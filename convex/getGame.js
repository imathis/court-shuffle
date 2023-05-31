import { query } from "./_generated/server";

export default query(async ({ db }, { slug }) => {
  if (slug) {
    return await db.query("games")
      .filter(q => q.eq(q.field("slug"), slug))
      .first();
  }
  return null
})
