import { cn, pluralize } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";

export const CourtStatus = () => {
  const lastDrawn = useGameStore((state) => state.game.lastDrawn);
  const players = useGameStore((state) => state.game.players);
  const cardsRemaining = players ? players - (lastDrawn + 1) : undefined;

  if (!players) return null;

  return (
    <div
      className={cn(
        "relative z-1 p-3 text-center text-2xl text-white select-none",
        cardsRemaining ? "bg-slate-800" : "bg-slate-600",
      )}
    >
      {lastDrawn < 0 ? (
        `${players} Players`
      ) : cardsRemaining ? (
        <>
          <span
            key={cardsRemaining}
            className="animate-in fade-in slide-in-from-top-20 relative inline-block duration-500"
          >
            {cardsRemaining}
          </span>
          {pluralize(" Card", cardsRemaining)} Left
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-20 relative inline-block duration-500">
          🎉 All Cards Drawn
        </div>
      )}
    </div>
  );
};
