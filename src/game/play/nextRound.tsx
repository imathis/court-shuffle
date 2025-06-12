import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const NextRound = () => {
  const game = useGameStore((state) => state.game);
  const isComplete = useGameStore((state) => state.isComplete());

  // Track if we've already shown the toast for this round
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Reset toast flag when a new round begins (lastDrawn is -1)
    if (game.lastDrawn === -1) {
      hasShownToast.current = false;
    }
  }, [game.lastDrawn]);

  useEffect(() => {
    if (isComplete && !hasShownToast.current) {
      hasShownToast.current = true;

      toast(
        <div className="flex flex-col gap-1">
          <div className="text-2xl">Round Complete! 🎉</div>
          <p className="text-lg text-slate-500">All cards have been drawn.</p>
        </div>,
        {
          position: "top-center",
          duration: 5000, // 5 seconds
        },
      );
    }
  }, [isComplete]);

  // Component no longer renders anything - toast handles the UI
  return null;
};
