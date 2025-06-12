import { Card } from "../store/types";

const allCourts: number[] = Array.from({ length: 13 }, (_, index) => index + 1);
const suits = ["spades", "hearts", "diamonds", "clubs"] as const;

const sort = <T extends string | number>(a: T, b: T): number => {
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getShortCourtDefault = (
  courts: number[] | undefined,
  shortCourt: number | undefined,
) => {
  if (!courts?.length) {
    return;
  }
  if (shortCourt && courts.includes(shortCourt)) {
    return shortCourt;
  } else {
    return [...courts].sort().reverse()[0];
  }
};

interface DeckOptions {
  courts?: number[];
  perCourt?: number;
  players?: number;
  shortCourt?: number;
}

const newDeck = (options: DeckOptions = {}): Card[] => {
  const { courts, perCourt = 4, players, shortCourt } = options;
  const deck: Card[] = [];

  if (!courts || !players) return deck;

  // If shortCourt is specified, arrange courts so shortCourt is last
  let sortedCourts: number[];
  if (shortCourt !== undefined && courts.includes(shortCourt)) {
    sortedCourts = courts
      .filter((court) => court !== shortCourt)
      .sort()
      .reverse();
    sortedCourts.push(shortCourt);
  } else {
    // Default behavior: sort and reverse
    sortedCourts = courts.sort().reverse();
  }

  for (const court of sortedCourts) {
    for (let count = 0; count < perCourt; count++) {
      if (deck.length < players) deck.push({ court, suit: suits[count] });
    }
  }

  for (let count = 0; deck.length < players; count++) {
    deck.push({ court: 0, suit: "joker" });
  }
  return shuffle(deck);
};

const newSlug = (length: number = 5): string => {
  const unambiguousChars = "234679ACDEFGHJKLMNPQRTUVWXYZ";
  let slug = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * unambiguousChars.length);
    slug += unambiguousChars[randomIndex];
  }
  return slug;
};

const getFormat = (card: Card | undefined, cards: Card[] | undefined) => {
  if (!card || !cards) return null;
  const onCourt = cards.filter(({ court }) => court === card.court).length;
  switch (onCourt) {
    case 1:
      return "ROTATION";
    case 2:
      return "SINGLES";
    case 3:
      return "3 PLAYER";
    default:
      return null;
  }
};

export { allCourts, getFormat, newDeck, newSlug, sort };
