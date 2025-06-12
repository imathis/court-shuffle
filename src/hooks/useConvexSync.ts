import { useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { Card, Game, ConvexSyncResult, GameDoc } from "@/store/types";

const isFromPreviousDay = (timestamp: number | undefined): boolean => {
  if (!timestamp) return false;

  const updatedDate = new Date(timestamp);
  const today = new Date();

  updatedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return updatedDate < today;
};

export function useConvexSync(): ConvexSyncResult {
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const setSyncStatus = useGameStore((state) => state.setSyncStatus);
  const configGame = useGameStore((state) => state.configGame);
  const unShareGame = useGameStore((state) => state.unShareGame);
  const setDrawnCard = useGameStore((state) => state.setDrawnCard);
  const slug = game.slug;

  const hasInitiatedSync = useRef<boolean>(false);
  const convexSyncInProgress = useRef<boolean>(false);
  const previousLastDrawn = useRef<number>(game.lastDrawn);

  const convexGame = useQuery(api.game.get, slug ? { slug } : "skip") as
    | GameDoc
    | null
    | undefined;
  const createGameMutation = useMutation(api.game.create);
  const configGameMutation = useMutation(api.game.config);
  const drawCardMutation = useMutation(api.game.draw);

  useEffect(() => {
    const currentGame = useGameStore.getState().game;

    const shouldConvertToLocalOnly =
      (currentGame.slug && convexGame === null) ||
      (convexGame && isFromPreviousDay(currentGame.updatedAt));

    if (shouldConvertToLocalOnly) {
      unShareGame();
    } else {
      if (
        convexGame &&
        currentGame &&
        JSON.stringify(currentGame) !==
          JSON.stringify({ ...currentGame, ...convexGame })
      ) {
        if (
          convexGame.lastDrawn === -1 &&
          previousLastDrawn.current !== -1 &&
          previousLastDrawn.current !== undefined
        ) {
          useGameStore.setState({
            currentCard: undefined,
            drawnIndex: -1,
          });
        }

        previousLastDrawn.current = convexGame.lastDrawn;

        setGame({ ...currentGame, ...convexGame });
      }
    }
  }, [convexGame, slug, setGame, unShareGame]);

  const syncToConvex = async (): Promise<Game | null> => {
    if (convexSyncInProgress.current || hasInitiatedSync.current) return null;
    if (convexGame && game.slug) return game;

    try {
      convexSyncInProgress.current = true;
      setSyncStatus("syncing");

      const opts: { slug?: string } = {};
      if (game.slug) opts.slug = game.slug;
      const createdGame = await createGameMutation(opts);
      if (!createdGame || !createdGame.slug) {
        setSyncStatus("failed");
        return null;
      }

      const updatedGame: Game = {
        ...game,
        slug: createdGame.slug,
        syncStatus: "synced",
      };

      setGame(updatedGame);
      hasInitiatedSync.current = true;

      if (game.cards) {
        const { syncStatus: _syncStatus, slug: _slug, ...gameForSync } = updatedGame;
        await configGameMutation({
          slug: createdGame.slug,
          game: { ...gameForSync, slug: createdGame.slug },
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

  const drawCardWithSync = async (): Promise<{
    card: Card;
    index: number;
  } | null> => {
    if (!game) return null;

    if (game.slug) {
      try {
        const result = await drawCardMutation({ slug: game.slug });
        if (result) {
          setDrawnCard(result.index);
          return {
            card: result.card as Card,
            index: result.index,
          };
        }
        return null;
      } catch (error) {
        console.error("Draw error:", error);

        if (
          (error as Error).message?.includes("not found") ||
          (error as { code?: number }).code === 404
        ) {
          console.log(
            "Game not found on Convex during draw, converting to local-only game",
          );
          unShareGame();
        }
        return null;
      }
    }

    useGameStore.getState().drawCard();
    return null;
  };

  const configGameWithSync = async (
    params: Partial<Pick<Game, "courts" | "players" | "perCourt">>,
  ): Promise<void> => {
    configGame(params);

    const currentGame = useGameStore.getState().game;
    if (currentGame?.slug) {
      try {
        const { syncStatus: _syncStatus, slug: _slug, ...gameForSync } = currentGame;
        await configGameMutation({
          slug: currentGame.slug!,
          game: { ...gameForSync, slug: currentGame.slug! },
        });
      } catch (error) {
        console.error("Config error:", error);

        if (
          (error as Error).message?.includes("not found") ||
          (error as { code?: number }).code === 404
        ) {
          console.log(
            "Game not found on Convex during config, converting to local-only game",
          );
          unShareGame();
        }
      }
    }
  };

  const joinGameBySlug = useCallback(async (slug: string): Promise<Game | null> => {
    if (!slug) return null;

    try {
      setSyncStatus("syncing");

      // Set the game slug so the convex query will fetch it
      const currentGame = useGameStore.getState().game;
      const gameWithSlug: Game = {
        ...currentGame,
        slug,
        syncStatus: "syncing",
      };

      setGame(gameWithSlug);
      return gameWithSlug;
    } catch (error) {
      console.error("Join game error:", error);
      setSyncStatus("failed");
      return null;
    }
  }, [setSyncStatus, setGame]);

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
