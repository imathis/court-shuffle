import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { GameConfigParams } from "@/store/types";

export function useConvexConfig() {
  const configGame = useGameStore((state) => state.configGame);
  const unShareGame = useGameStore((state) => state.unShareGame);
  const configGameMutation = useMutation(api.game.config);

  const configGameWithSync = async (params: GameConfigParams): Promise<void> => {
    // Update local state first
    configGame(params);

    const currentGame = useGameStore.getState().game;
    if (!currentGame?.slug) {
      // No slug, only local update needed
      return;
    }

    try {
      // Remove syncStatus before sending to Convex (it's local-only state)
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
          "Game not found on Convex during config, converting to local-only game"
        );
        unShareGame();
      }
    }
  };

  return { configGameWithSync };
}