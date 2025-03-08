import { mutation, query } from "./_generated/server";
import { newSlug } from "../src/helpers";
import { v } from "convex/values";

const getGame = async ({ db, slug }) => {
  return await db
    .query("games")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
};

const newGame = async ({ db, slug }) =>
  await db.insert("games", {
    slug,
    lastDrawn: -1,
    updatedAt: new Date().getTime(),
  });

// Ensure game slug is unique
const newGameSlug = async ({ db }) => {
  let slug = newSlug();
  let game = await getGame({ db, slug });

  // If a game was found, generate a new slug and try again
  while (game) {
    slug = newSlug();
    game = await getGame({ db, slug: newSlug() });
  }
  // Return slug that does not already exist in the database
  return slug;
};

export const get = query({
  args: { slug: v.string() },
  handler: async ({ db }, { slug } = {}) => {
    if (slug) {
      return getGame({ db, slug });
    }
  },
});

export const create = mutation({
  args: { slug: v.optional(v.string()) },
  handler: async ({ db }, args) => {
    const { slug = await newGameSlug({ db }) } = args;
    const game = await newGame({ db, slug });
    return { ...game, slug };
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
        slug: v.string(),
        updatedAt: v.number(),
      }),
    ),
  },
  handler: async ({ db }, { slug, game }) => {
    const dbGame = await getGame({ db, slug });
    const { cards, courts, players, perCourt, lastDrawn } = game;
    if (dbGame) {
      await db.patch(dbGame._id, {
        cards,
        courts,
        players,
        perCourt,
        lastDrawn,
        updatedAt: new Date().getTime(),
      });
    }
  },
});

export const draw = mutation({
  args: { slug: v.string() },
  handler: async ({ db }, { slug }) => {
    const game = await getGame({ db, slug });
    if (game) {
      const { cards, lastDrawn } = game;
      const index = lastDrawn === null ? 0 : lastDrawn + 1;

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
  },
});
