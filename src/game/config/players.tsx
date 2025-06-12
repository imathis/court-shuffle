import React from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigSection } from "./section";

interface PlayersProps {
  players: number;
  max: number;
  update: (num: number) => void;
}
export const Players: React.FC<PlayersProps> = ({ players, max, update }) => {
  const addPlayer = () => {
    if (players < max) update(players + 1);
  };

  const removePlayer = () => {
    if (players >= 3) update(players - 1);
  };

  return (
    <ConfigSection disabled={!players}>
      <div className="flex items-center justify-around text-center">
        <Button
          variant="subtle"
          size="pill-xl"
          aria-label="remove a player"
          disabled={players < 3}
          onClick={removePlayer}
        >
          <MinusIcon className="size-" strokeWidth={3} aria-hidden="true" />
        </Button>
        <div
          className="text-accent text-2xl font-bold"
          style={{ opacity: !max ? 0.5 : 1 }}
        >
          {players} Players
        </div>
        <Button
          variant="subtle"
          size="pill-xl"
          aria-label="add a player"
          disabled={players >= max}
          onClick={addPlayer}
        >
          <PlusIcon strokeWidth={3} aria-hidden="true" />
        </Button>
      </div>
    </ConfigSection>
  );
};
