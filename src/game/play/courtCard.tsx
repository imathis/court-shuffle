import { availableCards, getCardId } from "@/components/ui/cardSvgUtils";
import { useGameStore } from "@/store/gameStore";
import { useMemo } from "react";
import { useCardVisibility } from "./useCardVisibility";
import { AnimatedCard } from "./AnimatedCard";
import {
  calculateCardPositions,
  getCardsToRender,
  getCardKey,
  shouldFadeCard,
} from "./cardUtils";

/**
 * Main component for rendering the animated card stack
 * Manages card visibility, positioning, and performance optimization
 */
const CourtCard = () => {
  // Game state from store
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const cards = useGameStore((state) => state.game.cards);
  const localDrawnCards = useGameStore((state) => state.localDrawnCards);

  // Custom hook for managing card visibility transitions
  const { visibleCards } = useCardVisibility(localDrawnCards, drawnIndex);

  // Performance optimization: only render cards within range of current position
  const cardsToRender = useMemo(
    () => getCardsToRender(localDrawnCards, drawnIndex),
    [localDrawnCards, drawnIndex]
  );

  // Calculate positions for all cards in the stack
  const cardPositions = useMemo(
    () => calculateCardPositions(localDrawnCards, visibleCards.size),
    [localDrawnCards, visibleCards.size]
  );

  // Helper functions for card data access
  const getCardForIndex = (index: number) => cards?.[index];

  const getCardIdForIndex = (index: number) => {
    const card = getCardForIndex(index);
    return card ? getCardId(card) : undefined;
  };

  return (
    <div className="pointer-events-none fixed top-0 grid h-full w-full">
      {cardsToRender.map((deckIndex) => {
        const cardId = getCardIdForIndex(deckIndex);
        const isCardVisible = cardId && availableCards.includes(cardId);
        const shouldShow = visibleCards.has(deckIndex);
        const stackIndex = localDrawnCards.indexOf(deckIndex);
        const position = cardPositions.get(deckIndex);

        // Performance optimization: fade cards far from current position
        const shouldFade = shouldFadeCard(stackIndex, drawnIndex);

        if (!isCardVisible || !position || !cardId) return null;

        return (
          <AnimatedCard
            key={getCardKey(deckIndex, getCardForIndex(deckIndex))}
            cardId={cardId}
            cardKey={getCardKey(deckIndex, getCardForIndex(deckIndex))}
            shouldShow={shouldShow}
            stackIndex={stackIndex}
            position={position}
            shouldFade={shouldFade}
          />
        );
      })}
    </div>
  );
};

export { CourtCard };
