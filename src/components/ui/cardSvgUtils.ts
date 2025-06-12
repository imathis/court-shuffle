import { CardName, suits, Courts, Court, SuitName, Card } from "@/store/types";
import { FC, SVGProps } from "react";

// Import all SVG files in src/assets/cards/
const cardFiles = import.meta.glob("@/assets/cards/*.svg", {
  eager: false,
}) as Record<string, () => Promise<{ default: FC<SVGProps<SVGSVGElement>> }>>;

// Create a map of card names to glob keys
const cardPathMap = new Map<CardName, string>();
Object.keys(cardFiles).forEach((path) => {
  const cardName = path.split("/").pop()?.replace(".svg", "") as CardName;
  if (cardName) {
    cardPathMap.set(cardName, path);
  }
});

// Derive available card names from SVG file paths
export const availableCards: CardName[] = Array.from(cardPathMap.keys());

// Generate card names for a given court (e.g., "A" -> ["AS", "AC", "AH", "AD"])
export const getCourtCards = (court: Court): CardName[] => {
  if (court === "X") {
    return ["X"];
  }
  return Object.values(suits).map((suit) => `${court}${suit}` as CardName);
};

// Convert a Card object to its CardName (e.g., { court: 1, suit: "spades" } -> "AS")
export const getCardId = (card: Card | undefined): CardName | undefined => {
  if (!card) return undefined;
  if (card.suit === "joker") return "X";
  if (!(card.suit in suits)) return undefined;
  return `${Courts[card.court]}${suits[card.suit as SuitName]}` as CardName;
};

// Cache to store SVG component functions
const cardCache = new Map<CardName, FC<SVGProps<SVGSVGElement>>>();

// Preload specified cards or all available cards and cache components
export const preloadCards = async (courts: Court[]) => {
  let cardsToLoad: CardName[];
  if (!courts || courts.length === 0) {
    cardsToLoad = availableCards;
  } else {
    cardsToLoad = courts
      .flatMap((court) => getCourtCards(court))
      .filter((cardName) => availableCards.includes(cardName));
  }

  const loadPromises = cardsToLoad.map(async (cardName) => {
    if (cardCache.has(cardName)) {
      return; // Skip if cached
    }

    const importPath = cardPathMap.get(cardName);
    if (importPath && cardFiles[importPath]) {
      try {
        const cardModule = await cardFiles[importPath]();
        if (typeof cardModule.default === "function") {
          cardCache.set(cardName, cardModule.default);
        }
      } catch (err) {
        console.error(`Preload failed for ${cardName}:`, err);
      }
    }
  });

  await Promise.all(loadPromises);
};

export { cardCache, cardFiles, cardPathMap };