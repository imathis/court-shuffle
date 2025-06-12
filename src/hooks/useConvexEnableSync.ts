import { useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { Game } from "@/store/types";

export function useConvexEnableSync() {
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const setSyncStatus = useGameStore((state) => state.setSyncStatus);
  
  const hasInitiatedSync = useRef<boolean>(false);
  const convexSyncInProgress = useRef<boolean>(false);
  
  const createGameMutation = useMutation(api.game.create);
  const configGameMutation = useMutation(api.game.config);

  const enableSync = async (): Promise<Game | null> => {
    if (convexSyncInProgress.current || hasInitiatedSync.current) return null;
    if (game.slug) return game; // Already synced

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

      // Sync game configuration if cards exist
      if (game.cards) {
        // Remove syncStatus before sending to Convex (it's local-only state)
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

  return { enableSync };
}