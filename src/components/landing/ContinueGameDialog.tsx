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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ContinueGameDialog = () => {
  const navigate = useNavigate();
  const hasGame = useGameStore((state) => state.hasGame());
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (hasGame) {
      setShowDialog(true);
    }
  }, [hasGame]);

  const handleContinue = () => {
    setShowDialog(false);
    navigate("/play");
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent
        showCloseButton={false}
        className="rounded-4xl px-0 py-1 backdrop-blur-lg"
      >
        <DialogHeader>
          <DialogTitle className="pt-3 text-center text-3xl">
            Continue Game?
          </DialogTitle>
          <DialogDescription className="px-6 text-center text-lg">
            You have a game in progress. Would you like to continue playing?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-6 pt-0 pb-6">
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
              className="uppercase"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};