import { useGameStore } from "@/store/gameStore";

const cardStatus = (lastDrawn: number, players: number) => {
  if (lastDrawn < 0) return `${players} Players`;
  if (lastDrawn + 2 === players) return "1 Card Left";
  const cardsRemaining = players - (lastDrawn + 1);
  if (cardsRemaining) return `${cardsRemaining} Cards Left`;
  return "All Cards Drawn";
};

export const CourtStatus = () => {
  const lastDrawn = useGameStore((state) => state.game.lastDrawn);
  const players = useGameStore((state) => state.game.players);

  if (!players) return null;

  return (
    <div className="text-foreground bg-secondary relative z-1 p-3 text-center text-2xl select-none">
      {cardStatus(lastDrawn, players)}
    </div>
  );
};
