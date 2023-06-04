import { mutation, query } from "./_generated/server";
import { newDeck, newSlug } from '../src/helpers'

const getGame = async ({ db, slug }) => {
  return await db.query("games")
    .filter(q => q.eq(q.field("slug"), slug))
    .first()
}

const newGame = async ({ db, slug }) => {
  await db.insert("games", { slug, lastDrawn: -1 })
}

// Ensure game slug is unique
const newGameSlug = async ({ db }) => {
  let slug = newSlug()
  let game = await getGame({ db, slug })

  // If a game was found, generate a new slug and try again
  while (game) {
    slug = newSlug()
    game = await getGame({ db, slug: newSlug() })
  }
  // Return slug that does not already exist in the database
  return slug
}

export const get = query(async ({ db }, { slug }) => {
  if (slug) return await getGame({ db, slug })
})

export const create = mutation(async ({ db }, options = {}) => {
  const { slug = await newGameSlug({ db }) } = options
  await newGame({ db, slug })
  return slug
})

export const setup = mutation(async ({ db }, { slug, courts, players, perCourt }) => {
  const game = await getGame({ db, slug })
  if (game) {
    const cards = newDeck({ 
      courts: courts || game.courts,
      players: players || game.players,
      perCourt: perCourt || game.perCourt
    })
    await db.patch(game._id, { cards, courts, players, lastDrawn: -1, perCourt })
  }
})

export const draw = mutation(async ({ db }, { slug }) => {
  const game = await getGame({ db, slug })
  if (game) {
    const { cards, lastDrawn } = game
    const index = lastDrawn === null ? 0 : lastDrawn + 1

    if (cards[index]) {
      await db.patch(game._id, { lastDrawn: index })
      return { card: cards[index], index }
    } else {
      return null
    }
  }
})
