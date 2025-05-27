import { create } from "zustand";
import { persist } from "zustand/middleware";
import { newDeck } from "../helpers/gameHelpers";
import { Game, GameStoreState, GameStoreActions } from "./types";

const init: Game = {
  slug: null,
  cards: undefined,
  courts: undefined,
  players: undefined,
  lastDrawn: -1,
  perCourt: undefined,
  updatedAt: Date.now() as number, // Explicitly assert as number
};

export const gameStore = create<GameStoreState & GameStoreActions>()(
  persist(
    (set, get) => ({
      game: init,
      isDrawing: false,
      configVisible: false,
      drawnIndex: -1,
      currentCard: undefined,

      configGame: (args = {}) => {
        set(({ game }) => {
          const { courts, players, perCourt } = { ...game, ...args };
          return {
            game: {
              slug: game.slug,
              cards: newDeck({ courts, players, perCourt }),
              courts,
              players,
              perCourt,
              lastDrawn: -1,
              updatedAt: Date.now(),
            },
            drawnIndex: -1,
            currentCard: undefined,
          };
        });
      },

      unShareGame: () => {
        set((state) => ({
          game: {
            ...state.game,
            slug: null,
            syncStatus: "unsynced",
            updatedAt: Date.now(),
          },
        }));
      },

      setDrawnCard: (index) => {
        set((state) => ({
          game: {
            ...state.game,
            lastDrawn: index,
            updatedAt: Date.now(),
          },
          currentCard: state.game.cards?.[index],
          drawnIndex: index,
        }));
      },

      drawCard: () => {
        set({ isDrawing: true });
        const game = get().game;

        if (game.cards) {
          const index = game.lastDrawn + 1;
          if (game.cards[index]) {
            get().setDrawnCard(index);
          }
        }
        setTimeout(() => set({ isDrawing: false }), 800);
      },

      setConfigVisible: (visible) => {
        set({ configVisible: visible });
      },

      getNavigation: () => {
        const {
          drawnIndex,
          game: { lastDrawn, cards },
        } = get();
        return {
          back:
            drawnIndex > 0
              ? () =>
                  set({
                    currentCard: cards?.[drawnIndex - 1],
                    drawnIndex: drawnIndex - 1,
                  })
              : null,
          next:
            drawnIndex + 1 <= lastDrawn
              ? () =>
                  set({
                    currentCard: cards?.[drawnIndex + 1],
                    drawnIndex: drawnIndex + 1,
                  })
              : null,
        };
      },

      getUrl: () => {
        const slug = get().game.slug;
        return slug ? `https://courtshuffle.com/join/${slug}` : null;
      },

      getRoundOver: () => {
        const { cards, lastDrawn } = get().game;
        const cardsRemaining = cards?.length
          ? cards.length - (lastDrawn + 1)
          : 0;
        return Boolean(cards?.length && !cardsRemaining);
      },

      getInProgress: () => {
        return Boolean(get().game.cards?.length && !get().getRoundOver());
      },

      setGame: (newGame) => set({ game: newGame }),

      setSyncStatus: (status) =>
        set((state) => ({
          game: { ...state.game, syncStatus: status },
        })),
    }),
    {
      name: "game-state",
    },
  ),
);
