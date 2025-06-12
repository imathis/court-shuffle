import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourtCard } from "@/game/play/card";
import { Court } from "@/game/play/court";
import { CourtStatus } from "@/game/play/courtStatus";
import { ActionButton } from "@/game/play/actionButton";
import { CardNav } from "@/game/play/nav";
import { NextRound } from "@/game/play/nextRound";
import { useSyncThemeColorToBackground } from "@/hooks/useSyncThemeColor";
import { useGameStore } from "@/store/gameStore";
import { Config } from "@/game/config/config";
import { Header } from "@/game/Header";
import { preloadCards } from "@/components/ui/cardSvgUtils";
import { Courts, SuitType } from "@/store/types";
import { PlayErrorBoundary } from "@/components/PlayErrorBoundary";

const getSuitBgValue = (cardSuit: keyof typeof SuitType | undefined) => {
  const suit = cardSuit ? SuitType[cardSuit] : null;
  switch (suit) {
    case "red":
      return "var(--color-suit-red)";
    case "purple":
      return "var(--color-suit-purple)";
    default:
      return "var(--color-suit-black)";
  }
};

const PlayScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const card = useGameStore((state) => state.currentCard);
  const screenRef = React.useRef<HTMLDivElement>(null);
  useSyncThemeColorToBackground(screenRef);
  const suitVal = getSuitBgValue(card?.suit);

  return (
    <div
      className="bg-suit min-h-dvh overflow-hidden transition-colors duration-500"
      style={
        {
          "--color-suit": suitVal,
        } as React.CSSProperties
      }
      ref={screenRef}
    >
      <div className="grid h-max">{children}</div>
    </div>
  );
};

const Play = () => {
  const navigate = useNavigate();
  const courts = useGameStore((state) => state.game.courts);
  const cards = useGameStore((state) => state.game.cards);
  const slug = useGameStore((state) => state.game.slug);
  const canPlay = useGameStore((state) => state.canPlay);
  const [configVisible, setConfigVisible] = React.useState(false);

  // Combined logic: auto-open config OR redirect if needed
  useEffect(() => {
    // First priority: auto-open config if no courts are configured
    if (!courts?.length && !configVisible) {
      setConfigVisible(true);
      return; // Don't check redirect in this cycle
    }

    // Second priority: redirect if no game exists and config is not visible
    if (!canPlay() && !configVisible && courts === undefined && !slug) {
      navigate("/", { replace: true });
    }
  }, [canPlay, configVisible, courts, slug, navigate]);

  React.useEffect(() => {
    if (courts) {
      const courtCards = courts.map((c) => Courts[c]);
      preloadCards(courtCards);
    }
  }, [courts]);

  return (
    <PlayErrorBoundary>
      <PlayScreen>
        <Header />
        <NextRound />
        <CourtCard />
        {cards ? (
          <div className="fixed right-0 bottom-0 left-0">
            <ActionButton />
            <Court />
            <CourtStatus />
            <CardNav setConfigVisible={setConfigVisible} />
          </div>
        ) : null}
      </PlayScreen>
      <Config
        configVisible={configVisible}
        setConfigVisible={setConfigVisible}
      />
    </PlayErrorBoundary>
  );
};

export { Play };
