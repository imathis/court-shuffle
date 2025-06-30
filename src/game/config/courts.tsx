import React from "react";
import { sort, allCourts } from "../../helpers/gameHelpers";
import { ConfigSection } from "./section";
import { Button } from "@/components/ui/button";
import { useTouchClick } from "@/hooks/useTouchClick";

interface CourtsProps {
  courts: number[] | undefined;
  update: (courts: number[]) => void;
  perCourt: number | undefined;
}

export const Courts: React.FC<CourtsProps> = ({
  courts = [],
  update,
  perCourt,
}) => {
  const toggleCourt: CourtChange = React.useCallback(
    (event) => {
      if (!courts) return;
      const value = Number.parseInt(event.target.value, 10);
      const newCourts = courts.includes(value)
        ? courts.filter((c) => c !== value)
        : [...courts, value].sort(sort);
      update(newCourts);
    },
    [courts, update],
  );

  return (
    <>
      <ConfigSection
        disabled={!perCourt}
        title={courts.length ? "Courts" : "Select Courts"}
      >
        <div
          className="grid grid-cols-5 items-center justify-stretch gap-2 *:nth-11:col-start-2"
          role="group"
          aria-label="Select courts"
        >
          {allCourts.map((court) => (
            <Court
              key={court}
              type="checkbox"
              court={court}
              onChange={toggleCourt}
              checked={courts.includes(court)}
            />
          ))}
        </div>
      </ConfigSection>
    </>
  );
};

type CourtChange = React.ChangeEventHandler<HTMLInputElement>;

interface CourtProps {
  court: number;
  onChange: CourtChange;
  checked: boolean;
  type: "radio" | "checkbox";
  className?: string;
}

const Court: React.FC<CourtProps> = ({
  court,
  onChange,
  checked,
  type,
  className,
}) => {
  const touchHandlers = useTouchClick({
    onAction: () => {
      const syntheticEvent = {
        target: { value: court.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    },
  });

  return (
    <Button
      variant="checkButton"
      size="3xl"
      className={`touch-manipulation ${className || ''}`}
      {...touchHandlers}
      aria-pressed={checked}
      role={type === "checkbox" ? "checkbox" : "radio"}
      aria-checked={checked}
    >
      {court}
    </Button>
  );
};

interface ShortCourtProps {
  courts: number[] | undefined;
  perCourt: number | undefined;
  players: number | undefined;
  shortCourt: number | undefined;
  setShortCourt: (court: number) => void;
}

const shortCourtTitle = (count: number | undefined) => {
  switch (count) {
    case 1:
      return "Lone Court";
    case 2:
      return "Singles Court";
    case 3:
      return "3 Player Court";
    default:
      return "Extras";
  }
};

export const ShortCourt: React.FC<ShortCourtProps> = ({
  courts,
  players,
  perCourt,
  shortCourt,
  setShortCourt,
}) => {
  const count = (() => {
    if (players && perCourt && courts?.length) {
      return players < perCourt * courts.length ? players % perCourt : 0;
    }
  })();
  const disabled = !count || courts?.length === 1;
  const onChange: CourtChange = React.useCallback(
    (event) => {
      setShortCourt(Number.parseInt(event.target.value, 10));
    },
    [setShortCourt],
  );

  return (
    <ConfigSection
      disabled={disabled}
      title={shortCourtTitle(count)}
      className={disabled ? "max-h-0 overflow-hidden" : ""}
    >
      <div
        className="grid items-center justify-stretch gap-2"
        style={{
          gridTemplateColumns: `repeat(${Math.min(courts?.length || 1, 5)}, auto)`,
        }}
        role="radiogroup"
        aria-label="Select short court"
      >
        {courts
          ? [...courts]
              .sort()
              .map((court) => (
                <Court
                  key={court}
                  type="radio"
                  court={court}
                  onChange={onChange}
                  checked={shortCourt === court}
                />
              ))
          : null}
      </div>{" "}
    </ConfigSection>
  );
};
