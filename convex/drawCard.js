import { mutation } from "./_generated/server";

export default mutation(async ({ db }, { game }) => {
  const currentGame = await db.get(game._id)
  if (currentGame) {
    const { cards } = currentGame
    const nextCardIndex = cards.findIndex(({ drawn }) => !drawn)
    const card = cards[nextCardIndex]
    if (card) {
      card.drawn = true
      cards[nextCardIndex] = card
      await db.patch(game._id, { cards })
      return card
    } else {
      return null
    }
  }
})
