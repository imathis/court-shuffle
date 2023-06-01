import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    cards: v.optional(v.array(
      v.object({ court: v.string(), suit: v.string() })
    )),
    courts: v.optional(v.array(v.string())),
    players: v.optional(v.number()),
    lastDrawn: v.optional(v.number()),
    perCourt: v.optional(v.number()),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
});
