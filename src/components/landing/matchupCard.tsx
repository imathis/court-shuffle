import { CardName } from "@/store/types";
import { CardSvg } from "@/components/ui/cardSvg";
import { cn } from "@/lib/utils";

export const Matchup: React.FC<{
  cards: [CardName, CardName];
  court: number;
  type: "Partners" | "Opponents";
  className?: string;
}> = ({ cards, court, type, className }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl bg-slate-600 p-6",
      className,
    )}
  >
    <div className="flex h-full flex-col justify-center pr-30">
      <div className="leading-tigher text-xl opacity-75">{type} on</div>
      <div className="text-3xl leading-8 font-bold uppercase">
        Court {court}
      </div>
    </div>
    <CardSvg
      name={cards[0]}
      className="absolute top-6 -right-30 z-1 aspect-[934/1300] w-60 origin-center rounded-md border-1 border-black/20 bg-white"
    />
    <CardSvg
      name={cards[1]}
      className="absolute top-8 -right-36 z-2 aspect-[934/1300] w-60 origin-center rotate-10 rounded-md border-1 border-black/20 bg-white"
    />
  </div>
);
