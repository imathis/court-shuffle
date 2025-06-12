import { useGameStore } from "@/store/gameStore";
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

  return (
    <div className="bg-background/90 relative z-5 grid h-18 grid-cols-3 items-stretch">
      <Button
        size="none"
        variant="ghostInverted"
        onClick={navigateBack}
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
        onClick={navigateNext}
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
    </div>
  );
};
