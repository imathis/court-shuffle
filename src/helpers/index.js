const allCourts = Array(13).fill('').map((_, index) => index)
const suits = ['spades', 'hearts', 'diamonds', 'clubs'];

const sort = (a, b) => {
  if (a?.localeCompare) return a.localeCompare(b)
  if (a < b) return -1
  if (b < a) return 1
  return 0
}

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate deck
const newDeck = (options) => {
  const { 
    courts = allCourts,
    players = courts.length * 4,
    perCourt = 4,
  } = options

  const deck = []
  // Add cards for each court and player
  for (const court of courts.sort()) {
    for(let count = 0; count < perCourt; count++) {
      if (deck.length < players)
      deck.push({ court, suit: suits[count] });
    }
  }

  // For each extra player grab one court starting at the end
  for(let count = 0; deck.length < players; count++) {
    deck.push({ court: courts.reverse()[count], suit: 'joker' })
  }
  return shuffle(deck)
}

const newSlug = (length = 5) => {
  const unambiguousChars = '234679ACDEFGHJKLMNPQRTUVWXYZ';
  let slug = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * unambiguousChars.length);
    slug += unambiguousChars[randomIndex];
  }
  return slug;
}

export {
  newDeck,
  newSlug,
  allCourts,
  sort,
}
