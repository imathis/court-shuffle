import React from "react";
import { ConfigSection } from "./section";
import { Button } from "@/components/ui/button";
import { useTouchClick } from "@/hooks/useTouchClick";

interface FormatProps {
  perCourt: number | undefined;
  update: (num: number) => void;
}

const FormatButton: React.FC<{
  value: number;
  selected: boolean;
  onSelect: (value: number) => void;
  children: React.ReactNode;
}> = ({ value, selected, onSelect, children }) => {
  const touchHandlers = useTouchClick({
    onAction: () => onSelect(value),
  });

  return (
    <Button
      variant="checkButton"
      size="2xl"
      className="touch-manipulation"
      {...touchHandlers}
      aria-pressed={selected}
      role="radio"
      aria-checked={selected}
    >
      {children}
    </Button>
  );
};

export const Format: React.FC<FormatProps> = ({ perCourt, update }) => {
  return (
    <ConfigSection>
      <div
        className="grid auto-cols-auto grid-flow-col gap-2"
        role="radiogroup"
        aria-label="Game format"
      >
        <FormatButton value={2} selected={perCourt === 2} onSelect={update}>
          Singles
        </FormatButton>
        <FormatButton value={4} selected={perCourt === 4} onSelect={update}>
          Doubles
        </FormatButton>
      </div>
    </ConfigSection>
  );
};
