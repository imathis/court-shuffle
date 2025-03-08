import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef, useEffect } from "react";
import { newDeck } from "../helpers";

const init = {
  slug: null, // Null unless synced to Convex
  cards: undefined,
  courts: undefined,
  players: undefined,
  lastDrawn: -1,
  perCourt: undefined,
  updatedAt: Date.now(),
};

// Local game store
const gameStore = create(
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

      unshareGame: () => {
        set((state) => ({
          game: {
            ...state.game,
            slug: undefined,
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
          currentCard: state.game.cards[index],
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
                    currentCard: cards[drawnIndex - 1],
                    drawnIndex: drawnIndex - 1,
                  })
              : null,
          next:
            drawnIndex + 1 <= lastDrawn
              ? () =>
                  set({
                    currentCard: cards[drawnIndex + 1],
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
          game: state.game ? { ...state.game, syncStatus: status } : null,
        })),
    }),
    {
      name: "game-state",
    },
  ),
);

// Helper function to check if a timestamp is from a previous day
const isFromPreviousDay = (timestamp) => {
  if (!timestamp) return false;

  const updatedDate = new Date(timestamp);
  const today = new Date();

  // Reset hours to compare just the dates
  updatedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Check if the update was before today
  return updatedDate < today;
};

//Convex Sync logic
export function useConvexSync() {
  const game = gameStore((state) => state.game);
  const setGame = gameStore((state) => state.setGame);
  const setSyncStatus = gameStore((state) => state.setSyncStatus);
  const configGame = gameStore((state) => state.configGame);
  const unShareGame = gameStore((state) => state.unShareGame);
  const setDrawnCard = gameStore((state) => state.setDrawnCard);
  const slug = game.slug;

  // Track if we've initiated sync in this component instance
  const hasInitiatedSync = useRef(false);
  const convexSyncInProgress = useRef(false);

  // Convex queries and mutations
  // Only query if we have a valid slug
  const convexGame = useQuery(api.game.get, slug ? { slug } : "skip");
  const createGameMutation = useMutation(api.game.create);
  const configGameMutation = useMutation(api.game.config);
  const drawCardMutation = useMutation(api.game.draw);

  // Sync from Convex to local store if we have remote data
  useEffect(() => {
    const currentGame = gameStore.getState().game;

    // Conditions to convert to local-only game:
    // 1. Game not found on Convex but we have a local game with a slug
    // 2. Game was updated during the previous day
    const shouldConvertToLocalOnly =
      (currentGame.slug && convexGame === null) ||
      (convexGame && isFromPreviousDay(currentGame.updatedAt));

    if (shouldConvertToLocalOnly) {
      // Convert to local-only game by removing the slug
      unShareGame();
    } else {
      console.log("got here");
      if (
        convexGame &&
        currentGame &&
        JSON.stringify(currentGame) !==
          JSON.stringify({ ...currentGame, ...convexGame })
      ) {
        // Merge convex data with local data without causing unnecessary updates
        setGame({ ...currentGame, ...convexGame });
      }
    }
  }, [convexGame, slug, game]);

  // Methods that interact with Convex
  const syncToConvex = async () => {
    // Prevent multiple syncs
    if (convexSyncInProgress.current || hasInitiatedSync.current) return null;
    if (convexGame && game.slug) return game; // Already synced

    try {
      convexSyncInProgress.current = true;
      setSyncStatus("syncing");

      const opts = {};
      if (game.slug) opts.slug = game.slug;
      const createdGame = await createGameMutation(opts);
      if (!createdGame || !createdGame.slug) {
        setSyncStatus("failed");
        return null;
      }

      const updatedGame = {
        ...game,
        slug: createdGame.slug,
        syncStatus: "synced",
      };

      setGame(updatedGame);
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
      setSyncStatus("failed");
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
          setDrawnCard(result.index);
        }
        return result;
      } catch (error) {
        console.error("Draw error:", error);

        // If the error is because the game doesn't exist on Convex anymore,
        // convert to local-only game
        if (error.message?.includes("not found") || error.code === 404) {
          console.log(
            "Game not found on Convex during draw, converting to local-only game",
          );

          unShareGame();
        }
      }
    }

    return gameStore.getState().drawCard();
  };

  const configGameWithSync = async (params) => {
    configGame(params);

    const currentGame = gameStore.getState().game;
    if (currentGame?.slug) {
      try {
        await configGameMutation({
          slug: currentGame.slug,
          game: currentGame,
        });
      } catch (error) {
        console.error("Config error:", error);

        // If the error is because the game doesn't exist on Convex anymore,
        // convert to local-only game
        if (error.message?.includes("not found") || error.code === 404) {
          console.log(
            "Game not found on Convex during config, converting to local-only game",
          );

          unShareGame();
        }
      }
    }
  };

  // Join a game by slug
  // TODO: Just set the currrent game slug
  const joinGameBySlug = async (slug) => {
    if (!slug) return null;

    try {
      setSyncStatus("syncing");

      // First try to create the game with the specified slug
      // If it already exists, this will return the existing game
      const result = await createGameMutation({ slug });

      if (result && result.slug) {
        // Game created or already exists
        const currentGame = gameStore.getState().game;

        const updatedGame = {
          ...currentGame,
          ...result,
          syncStatus: "synced",
        };

        setGame(updatedGame);
        return updatedGame;
      } else {
        // If creation fails, set local game with the slug but mark as failed
        const currentGame = gameStore.getState().game;
        const failedGame = {
          ...currentGame,
          slug,
          syncStatus: "failed",
        };

        setGame(failedGame);
        return failedGame;
      }
    } catch (error) {
      console.error("Join game error:", error);
      setSyncStatus("failed");
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

// Main hook for interacting, abstracts away convex, and local game store
export function useGameStore() {
  // Get Convex sync capabilities
  const {
    enableSync,
    drawCardWithSync,
    configGameWithSync,
    joinGameBySlug,
    syncStatus,
  } = useConvexSync();

  return {
    gameStore,
    setGameConfig: configGameWithSync,
    drawCard: drawCardWithSync,
    enableSync,
    joinGame: joinGameBySlug,
    syncStatus,
  };
}
