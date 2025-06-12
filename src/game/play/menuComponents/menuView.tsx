import { Button } from "@/components/ui/button";
import { Undo2, Users, Share, Shuffle } from "lucide-react";

interface MenuViewProps {
  isPlaying: boolean;
  hasUndrawnCards: boolean;
  onRestart: () => void;
  onRedraw: () => void;
  onSettings: () => void;
  onShare: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  isPlaying,
  hasUndrawnCards,
  onRestart,
  onRedraw,
  onSettings,
  onShare,
}) => {
  const RestartButton = () => (
    <Button
      size="xl"
      variant="ghostInverted"
      onClick={onRestart}
      className="w-full justify-start"
    >
      <Undo2 className="mr-2 h-4 w-4" />
      Start Over
    </Button>
  );

  const RedrawButton = () => (
    <Button
      size="xl"
      variant="ghostInverted"
      onClick={onRedraw}
      className="w-full justify-start"
    >
      <Shuffle className="mr-2 h-4 w-4" />
      Redraw
    </Button>
  );

  const SettingsButton = () => (
    <Button
      size="xl"
      variant="ghostInvertedAccent"
      onClick={onSettings}
      className="w-full justify-start"
    >
      <Users className="mr-2 h-4 w-4" />
      Court Setup
    </Button>
  );

  const ShareButton = () => (
    <Button
      size="xl"
      variant="ghostInverted"
      onClick={onShare}
      className="w-full justify-start"
    >
      <Share className="mr-2 h-4 w-4" />
      Share Cards
    </Button>
  );

  return (
    <div className="flex flex-col gap-2">
      <ShareButton />
      <hr />
      {isPlaying && <RestartButton />}
      {isPlaying && hasUndrawnCards && <RedrawButton />}
      {isPlaying ? <hr /> : null}
      <SettingsButton />
    </div>
  );
};
