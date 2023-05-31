const allCourts = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', 'X'];
const allSuits = ['spades', 'hearts', 'diamonds', 'clubs'];

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
    players = courts.length * 4
  } = options

  const deck = []
  // Add cards for each court and player
  for (const court of courts) {
    for (const suit of allSuits) {
      if (deck.length < players)
      deck.push({ court, suit, drawn: false });
    }
  }

  // Add jokers to fill in extra players
  while (deck.length < players) {
    deck.push({ court: 'X', suit: 'none', drawn: false })
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
}
