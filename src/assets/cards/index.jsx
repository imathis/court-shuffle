import { useState, useEffect } from "react";

const courts = [
  "X",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "J",
  "Q",
  "K",
];
const suits = {
  spades: "S",
  clubs: "C",
  hearts: "H",
  diamonds: "D",
};

const getCourtCards = (court) => {
  // Handle Joker case
  if (courts[court] === "X") {
    return ["X"];
  }

  // Generate card names for all suits
  const suitValues = Object.values(suits); // ['S', 'C', 'H', 'D']
  return suitValues.map((suit) => `${courts[court]}${suit}`);
};

// Get all card SVG files and derive card names
const cardFiles = import.meta.glob("./*.svg");
const availableCards = Object.keys(cardFiles)
  .map((path) => {
    // Extract filename without extension from path
    return path.split("/").pop()?.replace(".svg", "") ?? "";
  })
  .filter(Boolean);

const CardSvg = ({ name, ...rest }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const cardModule = await cardFiles[`./${name}.svg`]();
        setIconComponent(() => cardModule.default);
      } catch (err) {
        console.error(err, `Failed to load card: ${name}`);
      } finally {
        //setLoading(false)
      }
    };

    loadCard();
  }, [name]);

  return IconComponent ? <IconComponent {...rest} /> : null;
};

// Optional: Pre-cache all card SVGs for better performance
// const preloadAllCards = async () => {
//   const loadPromises = Object.values(cardFiles).map(importFn => {
//     return importFn().catch(err => {
//       console.error('Failed to preload card', err)
//     })
//   })
//
//   await Promise.all(loadPromises)
// }
const preloadCards = async ({ cards } = {}) => {
  if (!cards || cards.length === 0) {
    const loadPromises = Object.values(cardFiles).map((importFn) => {
      return importFn().catch((err) => {
        console.error("Failed to preload card", err);
      });
    });
    await Promise.all(loadPromises);
    return;
  }

  // Use getCardNames to expand each court into full card names
  const cardsToLoad = cards
    .flatMap((court) => getCourtCards(court))
    .filter((cardName) => availableCards.includes(cardName));

  const loadPromises = cardsToLoad.map((cardName) => {
    const importFn = cardFiles[`./${cardName}.svg`];
    if (importFn) {
      return importFn().catch((err) => {
        console.error(`Failed to preload card: ${cardName}`, err);
      });
    }
    return Promise.resolve();
  });

  await Promise.all(loadPromises);
};

export { CardSvg, preloadCards, availableCards, courts, suits };
