import { mutation, query } from "./_generated/server";
import { newDeck, newSlug } from '../src/helpers'

const getGame = async ({ db, slug }) => {
  return await db.query("games")
    .withIndex("by_slug", q => q.eq("slug", slug)).first()
}

const newGame = async ({ db, slug }) => (
  await db.insert("games", { slug, lastDrawn: -1, updatedAt: new Date().getTime() })
)

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
  if (slug) {
    return getGame({ db, slug })
  }
})

export const create = mutation(async ({ db }, options = {}) => {
  const { slug = await newGameSlug({ db }) } = options
  const game = await newGame({ db, slug })
  return { ...game, slug }
})

export const config = mutation(async ({ db }, {
  slug,
  game: gameProp,
  courts = gameProp.courts,
  players = gameProp.players,
  perCourt = gameProp.perCourt,
}) => {
  const game = gameProp || await getGame({ db, slug })
  if (game) {
    const cards = newDeck( { courts, players, perCourt })
    await db.patch(game._id, { cards, courts, players, lastDrawn: -1, perCourt, updatedAt: new Date().getTime() })
  }
})

export const draw = mutation(async ({ db }, { game: gameProp, slug }) => {
  const game = gameProp || await getGame({ db, slug })
  if (game) {
    const { cards, lastDrawn } = game
    const index = lastDrawn === null ? 0 : lastDrawn + 1

    if (cards[index]) {
      await db.patch(game._id, { lastDrawn: index, updatedAt: new Date().getTime() })
      return { card: cards[index], index }
    } else {
      return null
    }
  }
})
