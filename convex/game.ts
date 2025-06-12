import { mutation, query } from "./_generated/server";
import { newSlug } from "../src/helpers/gameHelpers";
import { v } from "convex/values";
import type { DatabaseReader, DatabaseWriter } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

interface GameData {
  _id: Id<"games">;
  _creationTime: number;
  slug: string;
  cards?: Array<{ court: number; suit: string }>;
  courts?: number[];
  players?: number;
  lastDrawn?: number;
  perCourt?: number;
  shortCourt?: number;
  updatedAt: number;
}

const getGame = async ({
  db,
  slug,
}: {
  db: DatabaseReader;
  slug: string;
}): Promise<GameData | null> => {
  return await db
    .query("games")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
};

const newGame = async ({
  db,
  slug,
}: {
  db: DatabaseWriter;
  slug: string;
}): Promise<Id<"games">> =>
  await db.insert("games", {
    slug,
    lastDrawn: -1,
    updatedAt: new Date().getTime(),
  });

// Ensure game slug is unique
const newGameSlug = async ({ db }: { db: DatabaseReader }): Promise<string> => {
  let slug = newSlug();
  let game = await getGame({ db, slug });

  // If a game was found, generate a new slug and try again
  while (game) {
    slug = newSlug();
    game = await getGame({ db, slug });
  }
  // Return slug that does not already exist in the database
  return slug;
};

export const get = query({
  args: { slug: v.string() },
  handler: async ({ db }, { slug }): Promise<GameData | null> => {
    if (slug) {
      return getGame({ db, slug });
    }
    return null;
  },
});

export const create = mutation({
  args: { slug: v.optional(v.string()) },
  handler: async ({ db }, args): Promise<{ slug: string }> => {
    const { slug = await newGameSlug({ db }) } = args;
    await newGame({ db, slug });
    return { slug };
  },
});

export const config = mutation({
  args: {
    slug: v.string(),
    game: v.optional(
      v.object({
        cards: v.optional(
          v.array(v.object({ court: v.number(), suit: v.string() })),
        ),
        courts: v.optional(v.array(v.number())),
        players: v.optional(v.number()),
        lastDrawn: v.optional(v.number()),
        perCourt: v.optional(v.number()),
        shortCourt: v.optional(v.number()),
        slug: v.string(),
        updatedAt: v.number(),
      }),
    ),
  },
  handler: async ({ db }, { slug, game }): Promise<void> => {
    if (!game) return;

    const dbGame = await getGame({ db, slug });
    const { cards, courts, players, perCourt, shortCourt, lastDrawn } = game;

    if (dbGame) {
      await db.patch(dbGame._id, {
        cards,
        courts,
        players,
        perCourt,
        shortCourt,
        lastDrawn,
        updatedAt: new Date().getTime(),
      });
    }
  },
});

export const draw = mutation({
  args: {
    slug: v.string(),
  },
  handler: async (
    { db },
    { slug },
  ): Promise<{
    card: { court: number; suit: string };
    index: number;
  } | null> => {
    const game = await getGame({ db, slug });
    if (game) {
      const { cards, lastDrawn } = game;
      const index =
        lastDrawn === undefined || lastDrawn === -1 ? 0 : lastDrawn + 1;

      if (cards?.[index]) {
        await db.patch(game._id, {
          lastDrawn: index,
          updatedAt: new Date().getTime(),
        });
        return { card: cards[index], index };
      } else {
        return null;
      }
    }
    return null;
  },
});

export const redraw = mutation({
  args: {
    slug: v.string(),
    currentIndex: v.number(),
  },
  handler: async (
    { db },
    { slug, currentIndex },
  ): Promise<{
    cards: Array<{ court: number; suit: string }>;
    currentIndex: number;
    swappedIndex: number;
  } | null> => {
    const game = await getGame({ db, slug });
    if (game && game.cards) {
      const { cards, lastDrawn } = game;
      
      // Find remaining undrawn cards (indices after lastDrawn)
      const remainingCardIndices: number[] = [];
      for (let i = (lastDrawn ?? -1) + 1; i < cards.length; i++) {
        remainingCardIndices.push(i);
      }

      if (remainingCardIndices.length === 0) {
        return null; // No undrawn cards available
      }

      // Pick a random undrawn card
      const randomIndex = Math.floor(Math.random() * remainingCardIndices.length);
      const swapCardIndex = remainingCardIndices[randomIndex];

      // Swap the cards in the deck
      const newCards = [...cards];
      const tempCard = newCards[currentIndex];
      newCards[currentIndex] = newCards[swapCardIndex];
      newCards[swapCardIndex] = tempCard;

      // Update the database with the new deck order
      await db.patch(game._id, {
        cards: newCards,
        updatedAt: new Date().getTime(),
      });

      return {
        cards: newCards,
        currentIndex,
        swappedIndex: swapCardIndex,
      };
    }
    return null;
  },
});
