import { Card } from "@/store/types";

export interface CardPosition {
  top: number;
  rotate: number;
}

/**
 * Calculates the cumulative offset using exponential decay
 * Used for both position and rotation calculations to create natural card stacking
 */
const calculateCumulativeOffset = (
  cardsFromTop: number,
  baseIncrement: number,
  decayFactor: number
): number => {
  let totalOffset = 0;
  for (let i = 1; i <= cardsFromTop; i++) {
    const currentIncrement = baseIncrement * Math.pow(decayFactor, i - 1);
    totalOffset += currentIncrement;
  }
  return totalOffset;
};

/**
 * Calculates the vertical position offset for a card in the stack
 * Cards further from the top get progressively smaller offsets (exponential decay)
 */
const calculateTopOffset = (cardsFromTop: number): number => {
  if (cardsFromTop <= 0) return 0;
  
  const BASE_INCREMENT = 1;
  const DECAY_FACTOR = 0.8;
  
  return calculateCumulativeOffset(cardsFromTop, BASE_INCREMENT, DECAY_FACTOR);
};

/**
 * Calculates the rotation angle for a card in the stack
 * Top card has default rotation, cards below get progressively more rotation
 */
const calculateRotation = (cardsFromTop: number): number => {
  const TOP_CARD_ROTATION = -15;
  
  if (cardsFromTop <= 0) return TOP_CARD_ROTATION;
  
  const BASE_INCREMENT = 1.25;
  const DECAY_FACTOR = 0.8;
  
  const additionalRotation = calculateCumulativeOffset(
    cardsFromTop, 
    BASE_INCREMENT, 
    DECAY_FACTOR
  );
  
  return TOP_CARD_ROTATION - additionalRotation;
};

/**
 * Calculates positions for all cards in the drawn stack
 * Returns a Map with deck indices as keys and position data as values
 */
export const calculateCardPositions = (
  localDrawnCards: number[],
  totalVisibleCards: number
): Map<number, CardPosition> => {
  const positions = new Map<number, CardPosition>();
  const topCardPosition = totalVisibleCards - 1;

  localDrawnCards.forEach((deckIndex) => {
    const stackIndex = localDrawnCards.indexOf(deckIndex);
    const cardsFromTop = topCardPosition - stackIndex;

    const top = calculateTopOffset(cardsFromTop);
    const rotate = calculateRotation(cardsFromTop);

    positions.set(deckIndex, { top, rotate });
  });

  return positions;
};

/**
 * Filters cards to only those within performance range of current position
 * Limits rendering to cards within 5 positions for better performance
 */
export const getCardsToRender = (
  localDrawnCards: number[],
  drawnIndex: number,
  maxDistance: number = 5
): number[] => {
  return localDrawnCards.filter((_, index) => {
    const distanceFromCurrent = Math.abs(index - drawnIndex);
    return distanceFromCurrent <= maxDistance;
  });
};

/**
 * Generates a unique React key for a card that includes position and content
 * Ensures re-rendering when card content changes due to redraw
 */
export const getCardKey = (deckIndex: number, card: Card | undefined): string => {
  return card
    ? `${deckIndex}-${card.court}-${card.suit}`
    : `${deckIndex}-empty`;
};

/**
 * Determines if a card should be faded for performance reasons
 * Cards far from current position are faded to reduce visual complexity
 */
export const shouldFadeCard = (
  stackIndex: number,
  drawnIndex: number,
  fadeDistance: number = 4
): boolean => {
  const distanceFromCurrent = Math.abs(stackIndex - drawnIndex);
  return distanceFromCurrent > fadeDistance;
};