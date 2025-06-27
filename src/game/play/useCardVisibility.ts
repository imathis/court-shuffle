import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to manage card visibility state and transitions
 * Handles initialization and navigation-based visibility changes
 */
export const useCardVisibility = (
  localDrawnCards: number[],
  drawnIndex: number
) => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const prevDrawnIndex = useRef(drawnIndex);

  // Initialize visible cards when localDrawnCards is populated (on mount with existing data)
  useEffect(() => {
    if (localDrawnCards.length > 0 && visibleCards.size === 0) {
      // Initialize visible cards based on current local drawnIndex
      const initialVisibleCards = new Set(
        localDrawnCards.slice(0, drawnIndex + 1)
      );
      setVisibleCards(initialVisibleCards);
    }
  }, [localDrawnCards, drawnIndex, visibleCards.size]);

  // Handle navigation changes to trigger appropriate animations
  useEffect(() => {
    const prev = prevDrawnIndex.current;
    const current = drawnIndex;

    if (current !== prev) {
      // Update visible cards based on navigation direction
      // Forward or backward: show cards up to current local index
      const newVisibleCards = new Set(localDrawnCards.slice(0, current + 1));
      setVisibleCards(newVisibleCards);
    }

    prevDrawnIndex.current = current;
  }, [drawnIndex, localDrawnCards]);

  return { visibleCards };
};