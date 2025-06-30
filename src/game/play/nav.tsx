import { useGameStore } from "@/store/gameStore";
import { useTouchClick } from "@/hooks/useTouchClick";
import { Button } from "@/components/ui/button";
import { GameMenu } from "./gameMenu";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CardNavProps {
  setConfigVisible: (visible: boolean) => void;
}

export const CardNav = ({ setConfigVisible }: CardNavProps) => {
  const navigateNext = useGameStore((state) => state.navigateNext);
  const navigateBack = useGameStore((state) => state.navigateBack);
  const localDrawnCards = useGameStore((state) => state.localDrawnCards);
  const drawnIndex = useGameStore((state) => state.drawnIndex);

  // Navigation should be disabled when no cards are drawn or at boundaries
  const disableBack = localDrawnCards.length === 0 || drawnIndex <= 0;
  const disableNext =
    localDrawnCards.length === 0 || drawnIndex >= localDrawnCards.length - 1;

  const backTouchHandlers = useTouchClick({
    onAction: navigateBack,
    preventDoubleTouch: false,
    disabled: disableBack,
  });

  const nextTouchHandlers = useTouchClick({
    onAction: navigateNext,
    preventDoubleTouch: false,
    disabled: disableNext,
  });

  return (
    <nav className="[&_button]:pb-safe-min-5 relative z-5 grid grid-cols-3 items-stretch bg-slate-950/90 [&_button]:pt-5">
      <Button
        size="none"
        variant="ghostInverted"
        className="touch-manipulation"
        {...backTouchHandlers}
        aria-label="Previous Card"
        disabled={disableBack}
      >
        <ArrowLeft
          className="size-8 transition-all"
          strokeWidth={disableBack ? 1.5 : 3}
          width={32}
          height={32}
        />
      </Button>
      <GameMenu setConfigVisible={setConfigVisible} />
      <Button
        size="none"
        variant="ghostInverted"
        className="touch-manipulation"
        {...nextTouchHandlers}
        aria-label="Next Card"
        disabled={disableNext}
      >
        <ArrowRight
          className="size-8 transition-all"
          strokeWidth={disableNext ? 1.5 : 3}
          width={32}
          height={32}
        />
      </Button>
    </nav>
  );
};
