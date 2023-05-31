import { mutation } from "./_generated/server";
import { newDeck } from '../src/helpers'

export default mutation(async ({ db }, { game, courts = game.courts, players = game.players }) => {
  const currentGame = await db.get(game._id)
  if (currentGame) {
    const cards = newDeck({ courts, players })
    await db.patch(game._id, { cards, courts, players })
  }
})
