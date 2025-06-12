import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { Game } from "@/store/types";

export function useConvexJoin() {
  const setGame = useGameStore((state) => state.setGame);
  const setSyncStatus = useGameStore((state) => state.setSyncStatus);
  const createGameMutation = useMutation(api.game.create);

  const joinGameBySlug = async (slug: string): Promise<Game | null> => {
    if (!slug) return null;

    try {
      setSyncStatus("syncing");

      const result = await createGameMutation({ slug });

      if (result && result.slug) {
        const currentGame = useGameStore.getState().game;

        const updatedGame: Game = {
          ...currentGame,
          ...result,
          syncStatus: "synced",
        };

        setGame(updatedGame);
        return updatedGame;
      } else {
        const currentGame = useGameStore.getState().game;
        const failedGame: Game = {
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

  return { joinGameBySlug };
}