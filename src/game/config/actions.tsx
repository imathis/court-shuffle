import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGameStore } from "@/store/gameStore";
import { useConvexConfig } from "@/hooks/useConvexConfig";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";
import { DrawerTitle } from "@/components/ui/drawer";

interface ConfigActionsProps {
  perCourt: number | undefined;
  players: number | undefined;
  courts: number[] | undefined;
  shortCourt: number | undefined;
  container: "dialog" | "drawer";
  onCloseDialog: (open: boolean) => void;
}

export const ConfigActions: React.FC<ConfigActionsProps> = ({
  perCourt,
  courts,
  players,
  shortCourt,
  container,
  onCloseDialog,
}) => {
  const { configGameWithSync } = useConvexConfig();
  const isPlaying = useGameStore((state) => state.isPlaying());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const newRound = async () => {
    await configGameWithSync({ perCourt, courts, players, shortCourt });
    onCloseDialog(false);
  };

  const configGame = async () => {
    if (isPlaying) {
      setShowConfirmDialog(true);
    } else {
      newRound();
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    newRound();
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    onCloseDialog(false);
  };

  const confirmDialog = (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="z-[100]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Start New Round?</DialogTitle>
          <DialogDescription className="text-lg">
            There is a round in progress. Begin a new round with these settings?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="xl" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="xl" onClick={handleConfirm}>
            Start New Round
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {container === "drawer" ? (
        <div className="flex items-center justify-between gap-3 px-4">
          <Button variant="secondary" size="icon-xl" onClick={handleCancel}>
            <X strokeWidth={3} />
          </Button>
          <DrawerTitle className="text-3xl">Court Setup</DrawerTitle>
          <Button
            size="icon-xl"
            aria-label="Save"
            onClick={configGame}
            disabled={!(perCourt && players)}
          >
            <Check strokeWidth={3} />
          </Button>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 items-center gap-3">
          <Button
            size="xl"
            variant="secondary"
            className="uppercase"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="xl"
            aria-label="Save"
            className="uppercase"
            onClick={configGame}
            disabled={!(perCourt && players)}
          >
            Save
          </Button>
        </div>
      )}
      {confirmDialog}
    </>
  );
};
