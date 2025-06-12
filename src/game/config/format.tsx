import React from "react";
import { ConfigSection } from "./section";
import { Label } from "@/components/ui/label";

interface FormatProps {
  perCourt: number | undefined;
  update: (num: number) => void;
}

export const Format: React.FC<FormatProps> = ({ perCourt, update }) => {
  const handleFormatChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (event) => {
        const value = Number.parseInt(event.target.value, 10);
        update(value);
      },
      [update],
    );

  return (
    <ConfigSection>
      <div className="grid auto-cols-auto grid-flow-col gap-2">
        <Label className="">
          <input
            className="absolute -z-1 appearance-none"
            name="format"
            type="radio"
            onChange={handleFormatChange}
            checked={perCourt === 2}
            value={2}
          />
          Singles
        </Label>
        <Label className="">
          <input
            className="absolute -z-1 appearance-none"
            name="format"
            type="radio"
            onChange={handleFormatChange}
            checked={perCourt === 4}
            value={4}
          />
          Doubles
        </Label>
      </div>
    </ConfigSection>
  );
};
