import { Card } from "../store/types";

const allCourts: number[] = Array(14)
  .fill("")
  .map((_, index) => index);
const suits: string[] = ["spades", "hearts", "diamonds", "clubs"];

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

interface DeckOptions {
  courts?: number[];
  perCourt?: number;
  players?: number;
}

const newDeck = (options: DeckOptions = {}): Card[] => {
  const {
    courts = allCourts,
    perCourt = 4,
    players = courts.length * perCourt,
  } = options;

  const deck: Card[] = [];
  const sortedCourts = courts.sort().reverse();

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

export { newDeck, newSlug, allCourts, sort };
