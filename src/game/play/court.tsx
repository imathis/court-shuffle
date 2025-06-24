import { getFormat } from "@/helpers/gameHelpers";
import { useGameStore } from "@/store/gameStore";
import { Transition } from "@/components/ui/transition";
import { Ellipsis } from "lucide-react";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Court = () => {
  const card = useGameStore((state) => state.currentCard);
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const format = useGameStore((state) =>
    getFormat(state.currentCard, state.game.cards),
  );

  const prevDrawnIndexRef = useRef(drawnIndex);
  const forward = drawnIndex > prevDrawnIndexRef.current;

  useEffect(() => {
    prevDrawnIndexRef.current = drawnIndex;
  }, [drawnIndex]);

  return (
    <Transition
      toggle={!!card}
      duration={200}
      transitionProperties="height, opacity"
      from="h-0 opacity-0 origin-top overflow-hidden"
      to="h-26 opacity-100 origin-top overflow-hidden"
      className="text-suit relative z-1 items-center justify-center bg-white text-center text-7xl font-extrabold tracking-tight uppercase shadow-[0_-10px_16px_-4px_rgba(0,0,0,0.2)] ease-out select-none"
    >
      {!card ? (
        <div className="py-4">
          <Ellipsis className="inline-block size-20" />
        </div>
      ) : (
        <div
          className={cn(
            `animate-in fade-in-50 relative py-4 duration-400`,
            forward ? "slide-in-from-right-10" : "slide-in-from-left-10",
          )}
          key={`${card?.court}${card?.suit}${format}`}
        >
          {card?.suit === "joker" ? format : `court ${card.court}`}
        </div>
      )}
    </Transition>
  );
};
