const allCourts = Array(14)
  .fill("")
  .map((_, index) => index);
const suits = ["spades", "hearts", "diamonds", "clubs"];

const sort = (a, b) => {
  if (a?.localeCompare) return a.localeCompare(b);
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate deck
const newDeck = (options) => {
  const {
    courts = allCourts,
    perCourt = 4,
    players = courts.length * perCourt,
  } = options;

  const deck = [];
  const sortedCourts = courts.sort().reverse();
  // Add cards for each court and player
  for (const court of sortedCourts) {
    for (let count = 0; count < perCourt; count++) {
      if (deck.length < players) deck.push({ court, suit: suits[count] });
    }
  }

  // For each extra player grab one court starting at the end
  for (let count = 0; deck.length < players; count++) {
    deck.push({ court: 0, suit: "joker" });
  }
  return shuffle(deck);
};

const newSlug = (length = 5) => {
  const unambiguousChars = "234679ACDEFGHJKLMNPQRTUVWXYZ";
  let slug = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * unambiguousChars.length);
    slug += unambiguousChars[randomIndex];
  }
  return slug;
};

// Create a new game (no slug by default)
export const createGameLogic = () => ({
  slug: null, // Null unless synced to Convex
  cards: undefined,
  courts: undefined,
  players: undefined,
  lastDrawn: -1,
  perCourt: undefined,
  updatedAt: Date.now(),
});

// Configure a game
export const configGameLogic = (game, { courts, players, perCourt }) => {
  if (!game) return null;
  const cards = newDeck({ courts, players, perCourt });
  return {
    ...game,
    cards,
    courts,
    players,
    perCourt,
    lastDrawn: -1,
    updatedAt: Date.now(),
  };
};

// Draw a card
export const drawCardLogic = (game) => {
  if (!game || !game.cards) return null;
  const index = game.lastDrawn === null ? 0 : game.lastDrawn + 1;
  if (!game.cards[index]) return null;
  return {
    updatedGame: {
      ...game,
      lastDrawn: index,
      updatedAt: Date.now(),
    },
    result: { card: game.cards[index], index },
  };
};

export { newDeck, newSlug, allCourts, sort };
