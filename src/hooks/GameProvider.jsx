import React from 'react'
import { useQuery, useMutation } from 'convex/react';
import { useParams, Outlet } from 'react-router-dom'
import { Config } from '../game/config'

const GameContext = React.createContext({})

const getFormat = ({ card, deck }) => {
  const onCourt = deck.filter(({ court }) => court === card.court).length
  if (onCourt === 1) return 'ROTATION'
  if (onCourt === 2) return 'SINGLES'
  if (onCourt === 3) return '3 PLAYER'
  return null
}

const reduceDeck = (state, action) => {
  let { cards, index, format, deck } = state
  if (action?.cards) { cards = action.cards }
  if (typeof action?.lastDrawn === 'number') { index = action.lastDrawn }
  if (action?.card) {
    cards = [...cards, action.card]
    index = cards.length - 1
  }
  if (action?.game && !deck.length) { deck = action.game.cards }
  if (action === 'back' && cards.length > 1) index --
  if (action === 'next' && index < cards.length - 1) index ++
  if (action === 'reset') { cards = []; index = -1 }

  const card = cards[index]
  format = card ? getFormat({ card: cards[index], deck }) : format
  return { cards, index, card, deck, format }
}

const useGameHooks = () => {
  const { game: slug } = useParams()
  const [drawn, updateDrawn] = React.useReducer(reduceDeck, { cards: [], index: -1, deck: [], format: null })
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [configVisible, setConfigVisible] = React.useState(false)

  const configGame = useMutation("game:config")
  const drawCard = useMutation("game:draw")
  const create = useMutation("game:create")
  const game = useQuery("game:get", { slug });

  const openConfig = React.useCallback(() => setConfigVisible(true), [])
  const closeConfig = React.useCallback(() => setConfigVisible(false), [])

  const draw = React.useCallback(async () => {
    setIsDrawing(true)
    const { card } = await drawCard({ game, slug })
    if (card) updateDrawn({ card, game })
    setTimeout(() => setIsDrawing(false), 800)
    return card
  }, [slug, drawCard, game])

  const config = React.useCallback(async (props = {}) => {
    await configGame({ game, slug, ...props })
    updateDrawn('reset')
  }, [slug, configGame, game])

  // When game is new, reset drawn deck
  React.useEffect(() => {
    if (game?.lastDrawn === -1) updateDrawn('reset')
    if (drawn.cards.length === 0 && game?.cards?.length && game?.lastDrawn !== -1) {
      updateDrawn({
        game,
        cards: game.cards.slice(0, game.lastDrawn + 1),
        lastDrawn: game.lastDrawn,
      })
    }
  }, [game])

  const cardsRemaining = game?.cards?.length && game.cards.length - (game.lastDrawn + 1)
  const roundOver = game?.cards?.length && !cardsRemaining
  const inProgress = game?.cards?.length && !roundOver

  return React.useMemo(() => ({
    game,
    slug,
    create,
    config,
    draw,
    drawn,
    isDrawing,
    previous: drawn.index >= 1 ? () => updateDrawn('back') : null,
    next: drawn.index + 1 < drawn.cards.length ? () => updateDrawn('next') : null,
    url: `https://courtshuffle.com/game/${slug}`,
    reset: () => {
      config({ game })
    },
    roundOver,
    cardsRemaining,
    inProgress,
    isLoading: typeof game === 'undefined',
    notFound: game === null,
    configVisible,
    openConfig,
    closeConfig,
  }), [drawn, isDrawing, create, slug, draw, game, config, configVisible, openConfig, closeConfig, cardsRemaining, inProgress, roundOver])
}

const GameProvider = () => {
  const value = useGameHooks()
  return (
    <GameContext.Provider value={value}>
      { value.isLoading 
        ? <h1>Loading…</h1> 
        : (<>
            <Outlet />
            <Config {...value}/>
          </>)
      }
    </GameContext.Provider>
  )
}


export {
  GameContext,
  GameProvider,
}
