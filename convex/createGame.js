import { mutation } from "./_generated/server";
import { newDeck, newSlug } from '../src/helpers'

export default mutation(async ({ db }, { courts, players }) => {
  const cards = newDeck({ courts, players })
  const slug = newSlug()
  await db.insert("games", { slug, courts, players, cards })
  return slug
})
