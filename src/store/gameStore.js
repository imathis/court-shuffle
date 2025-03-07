import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation, useQuery } from "convex/react";
import { useRef, useEffect } from "react";
import { createGameLogic, configGameLogic, drawCardLogic } from "../helpers";

// 1. Create a SINGLE store instance outside of any React components
const gameStore = create(
  persist(
    (set, get) => ({
      game: null,
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
      setGame: (newGame) => set({ game: newGame }),
      setSyncStatus: (status) =>
        set((state) => ({
          game: state.game ? { ...state.game, syncStatus: status } : null,
        })),
    }),
    {
      name: "game-state",
      partialize: (state) => ({ game: state.game }),
    },
  ),
);

// 2. Create a separate hook to handle Convex sync logic
export function useConvexSync() {
  const game = gameStore((state) => state.game);
  const slug = game?.slug;

  // Track if we've initiated sync in this component instance
  const hasInitiatedSync = useRef(false);
  const convexSyncInProgress = useRef(false);

  // Convex queries and mutations
  // Only query if we have a valid slug
  const convexGame = useQuery("game:get", slug ? { slug } : "skip");
  const createGameMutation = useMutation("game:create");
  const configGameMutation = useMutation("game:config");
  const drawCardMutation = useMutation("game:draw");

  // One-time sync from Convex to local store if we have remote data
  useEffect(() => {
    if (convexGame && slug && slug === convexGame.slug) {
      const currentGame = gameStore.getState().game;
      // Merge convex data with local data without causing unnecessary updates
      if (
        currentGame &&
        JSON.stringify(currentGame) !==
          JSON.stringify({ ...currentGame, ...convexGame })
      ) {
        gameStore.setState({
          game: { ...currentGame, ...convexGame },
        });
      }
    }
  }, [convexGame, slug]);

  // Methods that interact with Convex
  const syncToConvex = async () => {
    // Prevent multiple syncs
    if (convexSyncInProgress.current || hasInitiatedSync.current) return null;
    if (!game) return null;
    if (convexGame && game.slug) return game; // Already synced

    try {
      convexSyncInProgress.current = true;
      gameStore.getState().setSyncStatus("syncing");

      const opts = {};
      if (game.slug) opts.slug = game.slug;
      const createdGame = await createGameMutation(opts);
      if (!createdGame || !createdGame.slug) {
        gameStore.getState().setSyncStatus("failed");
        return null;
      }

      const updatedGame = {
        ...game,
        slug: createdGame.slug,
        syncStatus: "synced",
      };

      gameStore.setState({ game: updatedGame });
      hasInitiatedSync.current = true;

      // Configure the remote game if we have cards
      if (game.cards) {
        await configGameMutation({
          slug: createdGame.slug,
          game,
        });
      }

      return updatedGame;
    } catch (error) {
      console.error("Sync error:", error);
      gameStore.getState().setSyncStatus("failed");
      return null;
    } finally {
      convexSyncInProgress.current = false;
    }
  };

  const drawCardWithSync = async () => {
    if (!game) return null;

    if (game.slug) {
      try {
        const result = await drawCardMutation({ slug: game.slug });
        if (result) {
          gameStore.setState({
            game: {
              ...game,
              lastDrawn: result.index,
              updatedAt: Date.now(),
            },
          });
        }
        return result;
      } catch (error) {
        console.error("Draw error:", error);
      }
    }

    return gameStore.getState().drawCard();
  };

  const configGameWithSync = async (params) => {
    gameStore.getState().configGame(params);

    const currentGame = gameStore.getState().game;
    if (currentGame?.slug) {
      try {
        await configGameMutation({
          slug: currentGame.slug,
          game: currentGame,
        });
      } catch (error) {
        console.error("Config error:", error);
      }
    }
  };

  // Join a game by slug
  const joinGameBySlug = async (gameSlug) => {
    if (!gameSlug) return null;

    try {
      gameStore.getState().setSyncStatus("syncing");

      // First try to create the game with the specified slug
      // If it already exists, this will return the existing game
      const result = await createGameMutation({ slug: gameSlug });

      if (result && result.slug) {
        // Game created or already exists
        const currentGame =
          gameStore.getState().game || gameStore.getState().createGame();

        const updatedGame = {
          ...currentGame,
          ...result,
          syncStatus: "synced",
        };

        gameStore.setState({ game: updatedGame });
        return updatedGame;
      } else {
        // If creation fails, set local game with the slug but mark as failed
        const currentGame =
          gameStore.getState().game || gameStore.getState().createGame();

        const failedGame = {
          ...currentGame,
          slug: gameSlug,
          syncStatus: "failed",
        };

        gameStore.setState({ game: failedGame });
        return failedGame;
      }
    } catch (error) {
      console.error("Join game error:", error);
      gameStore.getState().setSyncStatus("failed");
      return null;
    }
  };

  return {
    enableSync: syncToConvex,
    drawCardWithSync,
    configGameWithSync,
    joinGameBySlug,
    convexGame: slug ? convexGame : null,
    isSynced: !!game?.slug,
    syncStatus: game?.syncStatus || "unsynced",
  };
}

// 3. The main hook that combines local state with Convex capabilities
export function useGameStore() {
  // Get current game state from store
  const game = gameStore((state) => state.game);
  const createGame = gameStore((state) => state.createGame);

  // Get Convex sync capabilities
  const {
    enableSync,
    drawCardWithSync,
    configGameWithSync,
    joinGameBySlug,
    syncStatus,
  } = useConvexSync();

  // Create a game if one doesn't exist
  useEffect(() => {
    if (!game) {
      createGame();
    }
  }, [game]);

  return {
    game,
    createGame,
    configGame: configGameWithSync,
    drawCard: drawCardWithSync,
    enableSync,
    joinGame: joinGameBySlug,
    syncStatus,
  };
}
