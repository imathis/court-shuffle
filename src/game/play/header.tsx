import { LogoBanner } from "@/components/LogoBanner";
import { useGameStore } from "@/store/gameStore";

export const Header = () => {
  const currentCard = useGameStore((state) => state.currentCard);
  return (
    <div className="fixed w-full pt-4">
      <LogoBanner currentCard={currentCard} />
    </div>
  );
};
// --color-suit-red: hwb(0 3% 56%);
