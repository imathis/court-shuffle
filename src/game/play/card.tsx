import { CardSvg } from "@/components/ui/cardSvg";
import { availableCards, getCardId } from "@/components/ui/cardSvgUtils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useState, useRef } from "react";
import { Transition } from "@/components/ui/transition";

const CourtCard = () => {
  const drawnIndex = useGameStore((state) => state.drawnIndex);
  const game = useGameStore((state) => state.game);
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
  // For transitions to work properly, we need to render all cards that have ever been drawn
  const cardsToRender = localDrawnCards;

  // Get card data for each drawn index
  const getCardForIndex = (index: number) => {
    return game.cards?.[index];
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

  return (
    <div className="pointer-events-none fixed top-0 grid h-full w-full">
      {cardsToRender.map((deckIndex) => {
        const cardId = getCardIdForIndex(deckIndex);
        const isCardVisible = cardId && availableCards.includes(cardId);
        const shouldShow = visibleCards.has(deckIndex);
        const stackIndex = localDrawnCards.indexOf(deckIndex);

        if (!isCardVisible) return null;

        return (
          <Transition
            key={getCardKey(deckIndex)}
            toggle={shouldShow}
            duration={400}
            unmountOnExit={true}
            from="opacity-0 translate-y-[100vh] rotate-[140deg] md:translate-x-[150vw]"
            to="opacity-100 translate-y-0 rotate-0"
            className="absolute top-0 origin-bottom transform-gpu md:top-[6vh] md:place-self-center"
            style={{
              zIndex: 10 + stackIndex,
            }}
          >
            <CardSvg
              name={cardId}
              className="relative h-screen origin-center translate-x-[26vw] translate-y-[8vh] transform-gpu rounded-2xl border-2 border-black/20 bg-white transition-all delay-150 duration-300 md:h-[80vh] md:translate-x-[0]"
              style={{
                top: `${(() => {
                  const totalCards = visibleCards.size;
                  const cardPosition = stackIndex; // 0-based position in stack (0 = oldest/bottom, highest = newest/top)
                  const topCardPosition = totalCards - 1; // Most recent card position
                  const cardsFromTop = topCardPosition - cardPosition; // Distance from most recent (0 = most recent)

                  // Most recent card (top) at 0vh
                  if (cardsFromTop === 0) return 0;

                  const baseIncrement = 1; // Initial separation between cards (1vh)
                  const decayFactor = 0.8; // How much each increment decreases (same as rotation)

                  // Calculate cumulative offset by adding decreasing increments
                  let totalOffset = 0;
                  for (let i = 1; i <= cardsFromTop; i++) {
                    // Each increment is smaller than the previous
                    const currentIncrement =
                      baseIncrement * Math.pow(decayFactor, i - 1);
                    totalOffset += currentIncrement;
                  }

                  return totalOffset;
                })()}vh`,
                rotate: `${(() => {
                  const totalCards = visibleCards.size;
                  const cardPosition = stackIndex; // 0-based position in stack (0 = oldest/bottom, highest = newest/top)
                  const topCardPosition = totalCards - 1; // Most recent card position
                  const cardsFromTop = topCardPosition - cardPosition; // Distance from most recent (0 = most recent)

                  // Most recent card (top) always at -15deg
                  if (cardsFromTop === 0) return -15;

                  const topAngle = -15;
                  const baseIncrement = 1.25; // Initial separation between cards
                  const decayFactor = 0.8; // How much each increment decreases (0.8 = 20% reduction each step)

                  // Calculate cumulative rotation by adding decreasing increments
                  let totalRotation = 0;
                  for (let i = 1; i <= cardsFromTop; i++) {
                    // Each increment is smaller than the previous
                    const currentIncrement =
                      baseIncrement * Math.pow(decayFactor, i - 1);
                    totalRotation += currentIncrement;
                  }

                  return topAngle - totalRotation;
                })()}deg`,
              }}
            />
          </Transition>
        );
      })}
    </div>
  );
};

export { CourtCard };
