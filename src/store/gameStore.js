import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useEffect } from "react";
import { createGameLogic, configGameLogic, drawCardLogic } from "../helpers";

// Create the base Zustand store
const createGameStore = () =>
  create(
    persist(
      (set, get) => ({
        game: null, // Single game object
        createGame: () => {
          const newGame = createGameLogic();
          set({ game: newGame });
          return newGame;
        },
        configGame: ({ courts, players, perCourt }) => {
          const game = get().game;
          const updatedGame = configGameLogic(game, {
            courts,
            players,
            perCourt,
          });
          if (updatedGame) {
            set({ game: updatedGame });
          }
        },
        drawCard: () => {
          const game = get().game;
          const { updatedGame, result } = drawCardLogic(game) || {};
          if (updatedGame) {
            set({ game: updatedGame });
            return result;
          }
          return null;
        },
        setGame: (newGame) => set({ game: newGame }), // For syncing from Convex
      }),
      {
        name: "hybrid-game-state",
        partialize: (state) => ({ game: state.game }), // Persist the single game
      },
    ),
  );

// React custom hook to integrate Convex
export const useGameStore = () => {
  const store = useMemo(() => createGameStore(), []); // Memoize the store creation

  // Convex hooks
  const slug = store().game?.slug;
  const convexGame = useQuery(
    slug ? "game:get" : null, // Only query if slug exists, null skips query
    slug ? { slug } : undefined, // Arguments only when slug is present
  );
  const createGameMutation = useMutation("game:create");
  const configGameMutation = useMutation("game:config");
  const drawCardMutation = useMutation("game:draw");

  // Sync Convex data to local store
  useEffect(() => {
    if (convexGame && store().game?.slug === convexGame.slug) {
      store.setState({ game: { ...store().game, ...convexGame } });
    }
  }, [convexGame, store]);

  const createGame = () => store().createGame();

  const configGame = ({ courts, players, perCourt }) => {
    store().configGame({ courts, players, perCourt });
    const game = store().game;
    if (game?.slug) {
      configGameMutation({ slug: game.slug, courts, players, perCourt });
    }
  };

  const drawCard = async () => {
    const game = store().game;
    if (game?.slug) {
      const result = await drawCardMutation({ slug: game.slug });
      if (result) {
        store.setState({
          game: { ...game, lastDrawn: result.index, updatedAt: Date.now() },
        });
      }
      return result;
    }
    return store().drawCard();
  };

  const enableSync = async () => {
    const game = store().game;
    if (!game || game.slug) return;

    const createdGame = await createGameMutation({});
    const updatedGame = {
      ...game,
      slug: createdGame.slug,
      _id: createdGame._id,
    };
    store.setState({ game: updatedGame });

    if (game.cards) {
      await configGameMutation({
        slug: createdGame.slug,
        courts: game.courts,
        players: game.players,
        perCourt: game.perCourt,
      });
    }
  };

  return {
    game: store().game,
    createGame,
    configGame,
    drawCard,
    enableSync,
  };
};
