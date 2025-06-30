import { useGameStore } from "@/store/gameStore";
import { useConvexConfig } from "@/hooks/useConvexConfig";
import { useConvexDraw } from "@/hooks/useConvexDraw";
import { useConvexGame } from "@/hooks/useConvexGame";
import { useTouchClick } from "@/hooks/useTouchClick";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DISABLED_STYLES = "translate-y-28 scale-80 disabled:opacity-0";
const ENABLED_STYLES = "translate-y-0 scale-100";

export const ActionButton = () => {
  useConvexGame(); // Sync game state from Convex into store
  const game = useGameStore((state) => state.game);
  const canPlay = useGameStore((state) => state.canPlay());
  const isComplete = useGameStore((state) => state.isComplete());
  const { drawCard } = useConvexDraw();
  const { configGameWithSync } = useConvexConfig();
  const [showNextRound, setShowNextRound] = useState(false);
  const [drawDisabled, setDrawDisabled] = useState(false);
  const [displayText, setDisplayText] = useState("Draw");

  const handleDraw = async () => {
    await drawCard();
    // Disable draw button for 400ms to prevent double taps
    setDrawDisabled(true);
    setTimeout(() => setDrawDisabled(false), 400);
  };

  const handleNextRound = async () => {
    // Reset the delay for next time
    setShowNextRound(false);

    // Restart the game with current settings (resets lastDrawn to -1, generates new deck)
    await configGameWithSync({
      courts: game.courts,
      players: game.players,
      perCourt: game.perCourt,
      shortCourt: game.shortCourt,
    });
  };

  const drawTouchHandlers = useTouchClick({
    onAction: handleDraw,
    disabled: drawDisabled,
    preventDoubleTouch: true,
    doubleTouchDelay: 400,
  });

  const nextRoundTouchHandlers = useTouchClick({
    onAction: handleNextRound,
    disabled: !showNextRound,
  });

  // Delay showing next round actions when round ends
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShowNextRound(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    } else {
      // Reset when round is not over
      setShowNextRound(false);
    }
  }, [isComplete]);

  // Handle text changes during transitions and initial sync
  useEffect(() => {
    const showDraw = canPlay;
    const targetText = showDraw ? "Draw" : "Next Round";

    // If text needs to change, delay it by transition duration (except for initial sync)
    if (displayText !== targetText) {
      // Only delay text changes during transitions, not initial render
      // Initial render should immediately show correct text
      const isInitialRender = displayText === "Draw"; // Default state

      const timer = setTimeout(
        () => {
          setDisplayText(targetText);
        },
        isInitialRender ? 150 : 150,
      ); // No delay for initial render, 150ms for transitions

      return () => clearTimeout(timer);
    }
  }, [canPlay, isComplete, displayText]);

  // Determine what to show
  const showDraw = canPlay;
  const showNext = isComplete;

  if (!showDraw && !showNext) return null;

  return (
    <div className="grid place-items-center pb-6" key={displayText}>
      {displayText === "Draw" ? (
        <Button
          variant="action-draw"
          size="none"
          className={cn(
            !drawDisabled ? ENABLED_STYLES : DISABLED_STYLES,
            "animate-in fade-in duration-200 touch-manipulation",
          )}
          {...drawTouchHandlers}
          disabled={drawDisabled}
          aria-label="Draw next card"
          role="button"
        >
          {displayText}
        </Button>
      ) : (
        <Button
          variant="action-next"
          size="none"
          className={cn(
            showNextRound ? ENABLED_STYLES : DISABLED_STYLES,
            "animate-in fade-in duration-300 touch-manipulation",
          )}
          {...nextRoundTouchHandlers}
          disabled={!showNextRound}
          aria-label="Start next round"
          aria-describedby="round-complete"
          role="button"
        >
          {displayText}
          <span id="round-complete" className="sr-only">
            Round completed. Click to start a new round with the same settings.
          </span>
        </Button>
      )}
    </div>
  );
};
