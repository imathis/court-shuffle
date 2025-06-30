import { CardSvg } from "@/components/ui/cardSvg";
import { Transition } from "@/components/ui/transition";
import { CardName } from "@/store/types";
import { CardPosition } from "./cardUtils";

interface AnimatedCardProps {
  cardId: CardName;
  cardKey: string;
  shouldShow: boolean;
  stackIndex: number;
  position: CardPosition;
  shouldFade: boolean;
}

/**
 * Individual animated card component with transition effects
 * Handles the visual presentation and animation of a single card
 */
export const AnimatedCard = ({
  cardId,
  cardKey,
  shouldShow,
  stackIndex,
  position,
  shouldFade,
}: AnimatedCardProps) => {
  return (
    <Transition
      key={cardKey}
      toggle={shouldShow}
      duration={300}
      unmountOnExit={true}
      from="translate-y-[30vh] rotate-[140deg] md:translate-x-[30vw]"
      to="translate-y-0 rotate-0"
      className="absolute top-0 origin-bottom transform-gpu md:top-[6vh] md:place-self-center"
      style={{
        zIndex: 10 + stackIndex,
      }}
    >
      <CardSvg
        name={cardId}
        className="relative h-screen origin-center translate-x-[26vw] translate-y-[8vh] transform-gpu rounded-2xl border-2 border-black/20 bg-white md:h-[80vh] md:translate-x-[0]"
        style={{
          top: `${position.top}vh`,
          rotate: `${position.rotate}deg`,
          willChange: "transform, opacity",
          transition:
            "top 200ms ease-in-out 150ms, rotate 200ms ease-in-out 150ms, transform 200ms ease-in-out 150ms, opacity 200ms ease-in-out 150ms",
          opacity: shouldFade ? "0" : "1",
        }}
      />
    </Transition>
  );
};
