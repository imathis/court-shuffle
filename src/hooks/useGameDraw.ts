import { useGameStore } from "@/store/gameStore";
import { useConvexDraw } from "./useConvexDraw";
import { Card } from "@/store/types";

export function useGameDraw() {
  const game = useGameStore((state) => state.game);
  const localDrawCard = useGameStore((state) => state.drawCard);
  
  // Always call hooks unconditionally (follows Rules of Hooks)
  const { drawCard: convexDrawCard } = useConvexDraw();

  const drawCard = async (): Promise<{
    card: Card;
    index: number;
  } | null> => {
    // Conditional execution, not conditional hook calls
    if (game.slug) {
      return convexDrawCard();
    } else {
      localDrawCard();
      return null;
    }
  };

  return { drawCard };
}