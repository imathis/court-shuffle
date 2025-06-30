import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { newDeck, getShortCourtDefault } from "../helpers/gameHelpers";
import { Game, GameStoreState, GameStoreActions, GameStatus } from "./types";

// Initial game state
const init: Game = {
  slug: null,
  cards: undefined,
  courts: undefined,
  players: undefined,
  lastDrawn: -1,
  perCourt: 4,
  shortCourt: undefined,
  updatedAt: Date.now(),
};

// Define store type
type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
  persist<GameStore>(
    (set, get) => ({
      // State
      game: init,
      drawnIndex: -1,
      currentCard: undefined,
      localDrawnCards: [],

      // Actions
      configGame: (
        args: Partial<
          Pick<Game, "courts" | "players" | "perCourt" | "shortCourt">
        > = {},
      ) => {
        set(({ game }) => {
          const { courts, players, perCourt, shortCourt } = {
            ...game,
            ...args,
          };
          return {
            game: {
              slug: game.slug,
              cards: newDeck({ courts, players, perCourt, shortCourt }),
              courts,
              players,
              perCourt,
              shortCourt,
              lastDrawn: -1,
              updatedAt: Date.now(),
            },
            drawnIndex: -1,
            currentCard: undefined,
            localDrawnCards: [],
          };
        });
      },

      newGame: () => {
        set({ game: init });
        get().configGame();
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

      setDrawnCard: (deckIndex: number) => {
        set((state) => {
          if (state.game.cards?.[deckIndex] === undefined) {
            console.error("No such card exists");
            return state;
          }

          // Add to local drawn cards if not already present
          const newLocalDrawnCards = state.localDrawnCards.includes(deckIndex)
            ? state.localDrawnCards
            : [...state.localDrawnCards, deckIndex];

          // Set drawnIndex to the last position in local drawn cards (the newly drawn card)
          const localIndex = newLocalDrawnCards.length - 1;

          return {
            game: {
              ...state.game,
              lastDrawn: deckIndex, // Update shared pointer
              updatedAt: Date.now(),
            },
            currentCard: state.game.cards[deckIndex],
            drawnIndex: localIndex,
            localDrawnCards: newLocalDrawnCards,
          };
        });
      },

      drawCard: () => {
        const { game } = get();

        if (game.cards) {
          // Draw the next card from the shared deck (lastDrawn + 1)
          const nextIndex = game.lastDrawn + 1;
          if (game.cards[nextIndex]) {
            get().setDrawnCard(nextIndex);
          }
        }
      },

      navigateNext: () => {
        const {
          drawnIndex,
          localDrawnCards,
          game: { cards },
        } = get();

        // drawnIndex is now the local index, not deck index
        if (drawnIndex < localDrawnCards.length - 1) {
          const newLocalIndex = drawnIndex + 1;
          const deckIndex = localDrawnCards[newLocalIndex];
          set({
            currentCard: cards?.[deckIndex],
            drawnIndex: newLocalIndex,
          });
        }
      },

      navigateBack: () => {
        const {
          drawnIndex,
          localDrawnCards,
          game: { cards },
        } = get();

        // drawnIndex is now the local index, not deck index
        if (drawnIndex > 0) {
          const newLocalIndex = drawnIndex - 1;
          const deckIndex = localDrawnCards[newLocalIndex];
          set({
            currentCard: cards?.[deckIndex],
            drawnIndex: newLocalIndex,
          });
        }
      },

      hasGame: () => {
        return Boolean(get().game.cards?.length);
      },

      canPlay: () => {
        const { game } = get();
        return Boolean(game.cards?.length && !get().isComplete());
      },

      isPlaying: () => {
        const { game, localDrawnCards } = get();
        return Boolean(
          game.cards?.length &&
            localDrawnCards.length > 0 &&
            !get().isComplete(),
        );
      },

      isComplete: () => {
        const { cards, lastDrawn } = get().game;
        const cardsRemaining = cards?.length
          ? cards.length - (lastDrawn + 1)
          : 0;
        return Boolean(cards?.length && !cardsRemaining);
      },

      getGameStatus: (): GameStatus => {
        const store = get();
        return {
          hasGame: store.hasGame(),
          canPlay: store.canPlay(),
          isPlaying: store.isPlaying(),
          isComplete: store.isComplete(),
        };
      },

      setGame: (newGame: Game) => {
        const currentState = get();
        const currentGame = currentState.game;

        // Check if this is a new round (lastDrawn went from positive to -1)
        // BUT NOT during sync initialization
        const isNewRound = newGame.lastDrawn === -1;
        const isSyncInitialization =
          currentState.localDrawnCards.length > 0 &&
          newGame.slug &&
          !currentGame.slug;
        // Also check if we're in the middle of sync initialization (already have slug, but local cards should be preserved)
        const isOngoingSyncInit =
          currentState.localDrawnCards.length > 0 &&
          currentGame.slug &&
          newGame.slug === currentGame.slug &&
          newGame.syncStatus === "synced";

        if (isNewRound && !isSyncInitialization && !isOngoingSyncInit) {
          // New round detected - reset local state
          set({
            game: newGame,
            localDrawnCards: [],
            drawnIndex: -1,
            currentCard: undefined,
          });
        } else if (isSyncInitialization || isOngoingSyncInit) {
          // Sync initialization case: preserve existing local drawn cards when enabling sync
          set({ game: newGame });
        } else {
          // Normal sync update - preserve local state
          set({ game: newGame });
        }
      },

      setShortCourt: (court: number | undefined) => {
        set((state) => ({
          game: {
            ...state.game,
            shortCourt: court,
            updatedAt: Date.now(),
          },
        }));
      },

      setSyncStatus: (status: Game["syncStatus"]) =>
        set((state) => ({
          game: { ...state.game, syncStatus: status, updatedAt: Date.now() },
        })),

      addLocalDrawnCard: (index: number) => {
        set((state) => ({
          localDrawnCards: state.localDrawnCards.includes(index)
            ? state.localDrawnCards
            : [...state.localDrawnCards, index],
        }));
      },

      resetLocalDrawnCards: () => {
        set({ localDrawnCards: [] });
      },

      redrawCard: (cardIndex?: number) => {
        const { game, localDrawnCards, drawnIndex } = get();

        if (!game.cards || localDrawnCards.length === 0) {
          console.error("Cannot redraw: invalid state");
          return;
        }

        // Determine which card to redraw
        let currentCardIndex: number;
        if (cardIndex !== undefined) {
          // Validate that the provided cardIndex is in localDrawnCards
          if (!localDrawnCards.includes(cardIndex)) {
            console.error(
              `Cannot redraw: cardIndex ${cardIndex} is not in locally drawn cards`,
            );
            return;
          }
          currentCardIndex = cardIndex;
        } else {
          // Use current card (existing behavior)
          if (drawnIndex < 0) {
            console.error("Cannot redraw: no current card");
            return;
          }
          currentCardIndex = localDrawnCards[drawnIndex];
        }

        // Find remaining undrawn cards (indices after lastDrawn)
        const remainingCardIndices: number[] = [];
        for (let i = game.lastDrawn + 1; i < game.cards.length; i++) {
          remainingCardIndices.push(i);
        }

        if (remainingCardIndices.length === 0) {
          console.error("No undrawn cards available for redraw");
          return;
        }

        // Pick a random undrawn card
        const randomIndex = Math.floor(
          Math.random() * remainingCardIndices.length,
        );
        const swapCardIndex = remainingCardIndices[randomIndex];

        // Swap the cards in the deck
        const newCards = [...game.cards];
        const tempCard = newCards[currentCardIndex];
        newCards[currentCardIndex] = newCards[swapCardIndex];
        newCards[swapCardIndex] = tempCard;

        // Update the game state
        set((state) => ({
          game: {
            ...state.game,
            cards: newCards,
            updatedAt: Date.now(),
          },
          currentCard: newCards[currentCardIndex], // Update current card display
        }));
      },
    }),
    {
      name: "game-state",
      version: 2,
      migrate: (
        persistedState: unknown,
        _version: number,
      ): Partial<GameStore> => {
        const state = persistedState as Partial<GameStore>;

        // Validate game state - check if it's corrupted
        const isValidGame = (game: unknown): boolean => {
          if (!game || typeof game !== "object" || game === null) return false;

          const gameObj = game as Record<string, unknown>;

          // Check if game object has been corrupted into string indices
          if (typeof gameObj["0"] === "string") return false;

          // Validate required structure
          if (gameObj.cards && !Array.isArray(gameObj.cards)) return false;
          if (gameObj.courts && !Array.isArray(gameObj.courts)) return false;
          if (gameObj.players && typeof gameObj.players !== "number")
            return false;

          return true;
        };

        const hasValidGame = isValidGame(state?.game);

        // If corrupted, mark for recovery notification
        if (!hasValidGame && state?.game) {
          // Set a flag to trigger recovery notification
          if (!window.courtShuffle) window.courtShuffle = {};
          window.courtShuffle.gameRecoveryNeeded = true;
        }

        // Clean migration: remove any old properties and ensure all required properties exist
        const migratedGame = hasValidGame ? state.game : init;

        // Ensure shortCourt has proper defaults after migration
        if (
          migratedGame &&
          migratedGame.courts &&
          migratedGame.shortCourt === undefined
        ) {
          const defaultShortCourt = getShortCourtDefault(
            migratedGame.courts,
            migratedGame.shortCourt,
          );
          if (defaultShortCourt !== undefined) {
            migratedGame.shortCourt = defaultShortCourt;
          }
        }

        return {
          // Core game state with defaults applied
          game: migratedGame,

          // Game state - preserve if exists, otherwise use defaults
          drawnIndex: state?.drawnIndex ?? -1,
          currentCard: state?.currentCard || undefined,

          // Persist localDrawnCards - preserve if exists, otherwise use defaults
          localDrawnCards: Array.isArray(state?.localDrawnCards)
            ? state.localDrawnCards
            : [],
        } as Partial<GameStore>;
      },
    } as PersistOptions<GameStore>,
  ),
);
