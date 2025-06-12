import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { MenuView, ShareView, useShareGame } from "./menuComponents";
import { useConvexRedraw } from "@/hooks/useConvexRedraw";

interface GameMenuProps {
  setConfigVisible: (visible: boolean) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ setConfigVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareView, setShowShareView] = useState(false);
  const { configGame, isPlaying, game, navigateBack, navigateNext } =
    useGameStore();

  const slug = useGameStore((state) => state.game.slug);
  const localDrawnCards = useGameStore((state) => state.localDrawnCards);
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const shareLogic = useShareGame(slug);
  const { redrawCard } = useConvexRedraw();

  // Calculate if there are undrawn cards remaining
  const hasUndrawnCards = game.cards
    ? game.cards.length - (game.lastDrawn + 1) > 0
    : false;

  const handleRestartClick = () => {
    setIsMenuOpen(false);
    setShowShareView(false);
    // Restart with current game settings
    configGame({
      courts: game.courts,
      players: game.players,
      perCourt: game.perCourt,
      shortCourt: game.shortCourt,
    });
  };

  const handleRedrawClick = async () => {
    setIsMenuOpen(false);
    setShowShareView(false);

    // Check if smooth animation is possible
    // Need multiple cards and not be at the first card to navigate back
    const canAnimate = localDrawnCards.length > 1 && drawnIndex > 0;

    if (canAnimate) {
      // SMOOTH ANIMATION PATH
      // 1. Capture the current card index before any navigation
      const currentCardIndex = localDrawnCards[drawnIndex];

      // 2. Navigate back first (triggers exit animation)
      navigateBack();

      // 3. Wait briefly for exit animation to be visible (especially on mobile)
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 4. Start redraw with specific card index (now async)
      await redrawCard(currentCardIndex);

      // 5. Navigate forward (triggers entrance animation with new card)
      navigateNext();
    } else {
      // FALLBACK: Direct redraw (current behavior)
      // Used when only 1 card or already at first card
      await redrawCard();
    }
  };

  const handleSettingsClick = () => {
    setIsMenuOpen(false);
    setShowShareView(false);
    setConfigVisible(true);
  };

  const handleShareClick = () => {
    setShowShareView(true);
    // Auto-enable sync when share view opens if no slug exists
    if (!slug && !shareLogic.isLoading) {
      shareLogic.handleEnableSync();
    }
  };

  const handleBackToMenu = () => {
    setShowShareView(false);
    shareLogic.resetShareState();
  };

  const renderMenuContent = () => {
    if (showShareView) {
      return (
        <ShareView
          slug={slug}
          isLoading={shareLogic.isLoading}
          error={shareLogic.error}
          copied={shareLogic.copied}
          onBack={handleBackToMenu}
          onRetry={shareLogic.handleEnableSync}
          onShare={shareLogic.handleShareUrl}
        />
      );
    }

    return (
      <MenuView
        isPlaying={isPlaying()}
        hasUndrawnCards={hasUndrawnCards}
        onRestart={handleRestartClick}
        onRedraw={handleRedrawClick}
        onSettings={handleSettingsClick}
        onShare={handleShareClick}
      />
    );
  };

  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
    // Reset share view when menu closes
    if (!open) {
      setShowShareView(false);
      shareLogic.resetShareState();
    }
  };

  return (
    <Popover open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
      <PopoverTrigger asChild>
        <Button size="none" variant="ghostInverted" aria-label="Menu">
          <Menu className="size-8" strokeWidth={3} width={32} height={32} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        key={showShareView ? "share" : "menu"} // Force re-render when switching content
        className={showShareView ? "w-80 p-4" : "w-50 rounded-xl p-2"}
        align="center"
      >
        {renderMenuContent()}
      </PopoverContent>
    </Popover>
  );
};
