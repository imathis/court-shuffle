import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useGameStore } from "@/store/gameStore";
import React from "react";
import { Courts, ShortCourt } from "./courts";
import { Format } from "./format";
import { Players } from "./players";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfigActions } from "./actions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getShortCourtDefault } from "@/helpers/gameHelpers";

const removeEmptyCourts = (
  players: number,
  courts: number[],
  perCourt: number,
) => {
  const lessPlayers = courts.length * perCourt - players;
  const remove = Math.floor(lessPlayers / perCourt);
  return courts.slice(0, courts.length - remove);
};

interface ConfigProps {
  configVisible: boolean;
  setConfigVisible: (visible: boolean) => void;
}

const Config = ({ configVisible, setConfigVisible }: ConfigProps) => {
  const game = useGameStore((state) => state.game);

  const [courts, setCourts] = React.useState(game.courts);
  const [players, setPlayers] = React.useState(game.players);
  const [perCourt, setPerCourt] = React.useState(game.perCourt);
  const [shortCourt, setShortCourt] = React.useState(game.shortCourt);

  // Sync local state when dialog opens or when game store values change
  React.useEffect(() => {
    if (configVisible) {
      setCourts(game.courts);
      setPlayers(game.players);
      setPerCourt(game.perCourt);
      setShortCourt(game.shortCourt);
    }
  }, [
    configVisible,
    game.courts,
    game.players,
    game.perCourt,
    game.shortCourt,
  ]);

  // Set default shortCourt when it becomes needed and none is set
  React.useEffect(() => {
    if (players && perCourt && courts?.length) {
      const needsShortCourt = players < perCourt * courts.length;
      const hasMultipleCourts = courts.length > 1;

      // Only set default if no shortCourt is selected or current selection is invalid
      if (needsShortCourt && hasMultipleCourts) {
        const isCurrentValid = shortCourt && courts.includes(shortCourt);
        if (!isCurrentValid) {
          const defaultShortCourt = getShortCourtDefault(
            courts,
            game.shortCourt,
          );
          setShortCourt(defaultShortCourt);
        }
      }
    }
  }, [players, perCourt, courts, shortCourt, game.shortCourt]);

  const maxPlayers =
    perCourt && courts ? courts.length * perCourt + (perCourt - 1) : 1;

  const updatePerCourt = (pc: number) => {
    setPerCourt(pc);
    // Update default player count when format changes
    if (courts?.length) setPlayers(courts.length * pc);
  };

  const updateCourts = (c: number[]) => {
    setCourts(c);
    // When courts are added or removed, reset player count according to format
    if (perCourt) setPlayers(c.length * perCourt);
  };

  const updatePlayers = (p: number) => {
    setPlayers(p);
    if (p < 3 && perCourt === 4) setPerCourt(2);
    if (courts && perCourt) {
      const c = removeEmptyCourts(p, courts, perCourt);
      if (c.length !== courts.length) setCourts(c);
    }
  };

  const config = (
    <>
      <div className="flex flex-col overflow-y-auto">
        <Format perCourt={perCourt} update={updatePerCourt} />
        <Courts perCourt={perCourt} courts={courts} update={updateCourts} />
        <ShortCourt
          perCourt={perCourt}
          players={players}
          courts={courts}
          shortCourt={shortCourt}
          setShortCourt={setShortCourt}
        />
        <Players
          players={players || 0}
          update={updatePlayers}
          max={maxPlayers}
        />
      </div>
    </>
  );

  const handleDialogClose = (open: boolean) => {
    setConfigVisible(open);
    // No need to manually reset state - useEffect handles syncing
  };

  if (useMediaQuery("md")) {
    return (
      <Dialog open={configVisible} onOpenChange={handleDialogClose}>
        <DialogContent
          showCloseButton={false}
          className="rounded-4xl px-0 py-1 backdrop-blur-lg"
        >
          <DialogHeader>
            <DialogTitle className="pt-3 text-center text-3xl">
              Court Setup
            </DialogTitle>
            <DialogDescription className="sr-only">
              Set up your play format, courts, and set the player numbers.
            </DialogDescription>
          </DialogHeader>
          {config}
          <DialogFooter className="p-6 pt-0 pb-6">
            <ConfigActions
              onCloseDialog={handleDialogClose}
              container="dialog"
              shortCourt={shortCourt}
              perCourt={perCourt}
              courts={courts}
              players={players}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={configVisible}
      direction="bottom"
      onOpenChange={handleDialogClose}
    >
      <DrawerContent className="bg-slate-950/80 px-0 pt-1 pb-3 backdrop-blur-lg">
        <DrawerHeader className="px-0 pt-1 pb-2">
          <DrawerDescription className="sr-only">
            Set up your play format, courts, and set the player numbers.
          </DrawerDescription>
          <ConfigActions
            onCloseDialog={handleDialogClose}
            container="drawer"
            shortCourt={shortCourt}
            perCourt={perCourt}
            courts={courts}
            players={players}
          />
        </DrawerHeader>
        {config}
      </DrawerContent>
    </Drawer>
  );
};

export { Config };
