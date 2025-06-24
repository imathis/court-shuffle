import { CardSvg } from "@/components/ui/cardSvg";
import { availableCards, getCardId } from "@/components/ui/cardSvgUtils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useState, useRef, useMemo } from "react";

const CourtCard = () => {
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const cards = useGameStore((state) => state.game.cards);
  const localDrawnCards = useGameStore((state) => state.localDrawnCards);
  // Track which cards should be visible (with transitions)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const prevDrawnIndex = useRef(drawnIndex);

  // Initialize visible cards when localDrawnCards is populated (on mount with existing data)
  useEffect(() => {
    if (localDrawnCards.length > 0 && visibleCards.size === 0) {
      // Initialize visible cards based on current local drawnIndex
      const initialVisibleCards = new Set(
        localDrawnCards.slice(0, drawnIndex + 1),
      );
      setVisibleCards(initialVisibleCards);
    }
  }, [localDrawnCards, drawnIndex, visibleCards.size]);

  // Handle navigation changes to trigger appropriate animations
  useEffect(() => {
    const prev = prevDrawnIndex.current;
    const current = drawnIndex;

    if (current > prev) {
      // Forward navigation: show cards up to current local index
      const newVisibleCards = new Set(localDrawnCards.slice(0, current + 1));
      setVisibleCards(newVisibleCards);
    } else if (current < prev) {
      // Backward navigation: show only cards up to current local index
      // This will hide cards after the current position via transition out
      const newVisibleCards = new Set(localDrawnCards.slice(0, current + 1));
      setVisibleCards(newVisibleCards);
    }

    prevDrawnIndex.current = current;
  }, [drawnIndex, localDrawnCards]);

  // Get all cards that need to be rendered (either visible or animating out)
  // Limit to cards within 6 positions of current for performance
  const cardsToRender = useMemo(() => {
    return localDrawnCards.filter((_, index) => {
      const distanceFromCurrent = Math.abs(index - drawnIndex);
      return distanceFromCurrent <= 5;
    });
  }, [localDrawnCards, drawnIndex]);

  // Get card data for each drawn index
  const getCardForIndex = (index: number) => {
    return cards?.[index];
  };

  const getCardIdForIndex = (index: number) => {
    const card = getCardForIndex(index);
    return card ? getCardId(card) : undefined;
  };

  // Generate a unique key for each card that includes both index and card content
  // This ensures React re-renders when the card content changes due to redraw
  const getCardKey = (deckIndex: number) => {
    const card = getCardForIndex(deckIndex);
    return card
      ? `${deckIndex}-${card.court}-${card.suit}`
      : `${deckIndex}-empty`;
  };

  // Memoize position calculations to avoid expensive re-calculations
  const cardPositions = useMemo(() => {
    const totalCards = visibleCards.size;
    const positions = new Map<number, { top: number; rotate: number }>();

    localDrawnCards.forEach((deckIndex) => {
      const stackIndex = localDrawnCards.indexOf(deckIndex);
      const cardPosition = stackIndex;
      const topCardPosition = totalCards - 1;
      const cardsFromTop = topCardPosition - cardPosition;

      // Calculate top offset
      let topOffset = 0;
      if (cardsFromTop > 0) {
        const baseIncrement = 1;
        const decayFactor = 0.8;

        for (let i = 1; i <= cardsFromTop; i++) {
          const currentIncrement = baseIncrement * Math.pow(decayFactor, i - 1);
          topOffset += currentIncrement;
        }
      }

      // Calculate rotation
      let rotation = -15; // Top card default
      if (cardsFromTop > 0) {
        const baseIncrement = 1.25;
        const decayFactor = 0.8;
        let totalRotation = 0;

        for (let i = 1; i <= cardsFromTop; i++) {
          const currentIncrement = baseIncrement * Math.pow(decayFactor, i - 1);
          totalRotation += currentIncrement;
        }

        rotation = -15 - totalRotation;
      }

      positions.set(deckIndex, { top: topOffset, rotate: rotation });
    });

    return positions;
  }, [localDrawnCards, visibleCards.size]);

  return (
    <div className="pointer-events-none fixed top-0 grid h-full w-full">
      {cardsToRender.map((deckIndex) => {
        const cardId = getCardIdForIndex(deckIndex);
        const isCardVisible = cardId && availableCards.includes(cardId);
        const shouldShow = visibleCards.has(deckIndex);
        const stackIndex = localDrawnCards.indexOf(deckIndex);
        const position = cardPositions.get(deckIndex);

        // Fade cards that are far from current position
        const distanceFromCurrent = Math.abs(stackIndex - drawnIndex);
        const shouldFadeForPerformance = distanceFromCurrent > 4;

        if (!isCardVisible || !position) return null;

        return (
          <div
            key={getCardKey(deckIndex)}
            className="absolute top-0 origin-bottom transform-gpu md:top-[6vh] md:place-self-center"
            style={{
              zIndex: 10 + stackIndex,
              opacity: shouldShow ? 1 : 0,
              transform: shouldShow
                ? "translateY(0) rotate(0deg)"
                : "translateY(50vh) rotate(140deg)",
              transition:
                "opacity 400ms ease-in-out, transform 400ms ease-in-out",
              willChange: "opacity, transform",
            }}
          >
            <CardSvg
              name={cardId}
              className="relative h-screen origin-center translate-x-[26vw] translate-y-[8vh] transform-gpu rounded-2xl border-2 border-black/20 bg-white md:h-[80vh] md:translate-x-[0]"
              style={{
                top: `${position.top}vh`,
                rotate: `${position.rotate}deg`,
                willChange: "transform, opacity",
                transition:
                  "top 300ms ease-in-out 150ms, rotate 300ms ease-in-out 150ms, transform 300ms ease-in-out 150ms, opacity 200ms ease-in-out 150ms",
                opacity: shouldFadeForPerformance ? "0" : "1",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export { CourtCard };
