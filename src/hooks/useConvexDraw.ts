import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGameStore } from "@/store/gameStore";
import { Card } from "@/store/types";

export function useConvexDraw() {
  const game = useGameStore((state) => state.game);
  const setDrawnCard = useGameStore((state) => state.setDrawnCard);
  const unShareGame = useGameStore((state) => state.unShareGame);
  
  // Always call the hook, but conditionally execute
  const drawCardMutation = useMutation(api.game.draw);

  const drawCard = async (): Promise<{
    card: Card;
    index: number;
  } | null> => {
    if (!game?.slug) {
      // No slug, draw locally
      useGameStore.getState().drawCard();
      return null;
    }

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
          "Game not found on Convex during draw, converting to local-only game"
        );
        unShareGame();
      }
      return null;
    }
  };

  return { drawCard };
}