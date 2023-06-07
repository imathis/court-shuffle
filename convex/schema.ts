import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    cards: v.optional(v.array(
      v.object({ court: v.number(), suit: v.string() })
    )),
    courts: v.optional(v.array(v.number())),
    players: v.optional(v.number()),
    lastDrawn: v.optional(v.number()),
    perCourt: v.optional(v.number()),
    slug: v.string(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),
});
