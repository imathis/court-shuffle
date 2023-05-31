import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    cards: v.array(
      v.object({ drawn: v.boolean(), court: v.string(), suit: v.string() })
    ),
    courts: v.array(v.string()),
    players: v.number(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
});
