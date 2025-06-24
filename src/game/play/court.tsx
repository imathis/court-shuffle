import { getFormat } from "@/helpers/gameHelpers";
import { useGameStore } from "@/store/gameStore";
import { Transition } from "@/components/ui/transition";
import { Ellipsis } from "lucide-react";

export const Court = () => {
  const card = useGameStore((state) => state.currentCard);
  const format = useGameStore((state) =>
    getFormat(state.currentCard, state.game.cards),
  );

  return (
    <Transition 
      toggle={!!card}
      duration={400}
      transitionProperties="height,opacity"
      from="h-0 opacity-0 origin-top overflow-hidden"
      to="h-26 opacity-100 origin-top overflow-hidden"
      className="shadow-[0_-10px_16px_-4px_rgba(0,0,0,0.2)]"
    >
      <div className="dark:bg-foreground dark:text-suit text-background bg-suit relative z-1 py-4 text-center text-7xl font-extrabold tracking-tighter transition-colors duration-300 ease-out select-none">
        {card?.suit === "joker" ? (
          format
        ) : card?.court ? (
          `COURT ${card?.court || ""}`
        ) : (
          <Ellipsis className="inline-block size-20" />
        )}
      </div>
    </Transition>
  );
};
