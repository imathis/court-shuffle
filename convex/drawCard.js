import { mutation } from "./_generated/server";

export default mutation(async ({ db }, { game }) => {
  const currentGame = await db.get(game._id)
  if (currentGame) {
    const { cards, lastDrawn } = currentGame
    const index = lastDrawn === null ? 0 : lastDrawn + 1

    if (cards[index]) {
      await db.patch(game._id, { lastDrawn: index })
      return cards[index]
    } else {
      return null
    }
  }
})
