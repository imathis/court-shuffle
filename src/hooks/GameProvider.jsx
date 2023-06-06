import React from 'react'
import { useQuery, useMutation } from "../../convex/_generated/react";
import { useParams, Outlet } from 'react-router-dom'
import { Setup } from '../game/setup'

const GameContext = React.createContext({})

const reduceDeck = (state, action) => {
  let { cards, index } = state
  if (action?.card) {
    cards = [...cards, action.card]
    index = cards.length - 1
  }
  else if (action === 'back' && cards.length > 1) index --
  else if (action === 'next' && index < cards.length - 1) index ++
  else if (action === 'reset') { cards = []; index = -1 }

  return { cards, index, card: cards[index] }
}

const useGameHooks = () => {
  const { game: slug } = useParams()
  const [drawn, updateDrawn] = React.useReducer(reduceDeck, { cards: [], index: -1 })
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [configVisible, setConfigVisible] = React.useState(false)

  const setupGame = useMutation("game:setup")
  const drawCard = useMutation("game:draw")
  const create = useMutation("game:create")
  const game = useQuery("game:get", { slug });

  const openConfig = React.useCallback(() => setConfigVisible(true), [])
  const closeConfig = React.useCallback(() => setConfigVisible(false), [])

  const draw = React.useCallback(async () => {
    setIsDrawing(true)
    const { card } = await drawCard({ slug })
    if (card) updateDrawn({ card })
    setTimeout(() => setIsDrawing(false), 800)
    return card
  }, [slug, drawCard])

  const setup = React.useCallback(async (props = {}) => {
    await setupGame({ slug, ...props })
    updateDrawn('reset')
  }, [slug, setupGame])

  // When game is new, reset drawn deck
  React.useEffect(() => {
    if (game?.lastDrawn === -1) updateDrawn('reset')
  }, [game])

  const roundOver = game && game.lastDrawn + 1 === game?.cards?.length;
  const inProgress = game && game.cards?.length && !roundOver

  return React.useMemo(() => ({
    game,
    slug,
    create,
    setup,
    draw,
    drawn,
    isDrawing,
    previous: drawn.index >= 1 ? () => updateDrawn('back') : null,
    next: drawn.index + 1 < drawn.cards.length ? () => updateDrawn('next') : null,
    url: `https://courtshuffle.com/game/${slug}`,
    reset: () => setup(),
    roundOver,
    inProgress,
    isLoading: typeof game === 'undefined',
    notFound: game === null,
    configVisible,
    openConfig,
    closeConfig,
  }), [drawn, isDrawing, create, slug, draw, game, setup, configVisible, openConfig, closeConfig, inProgress, roundOver])
}

const GameProvider = () => {
  const value = useGameHooks()
  return (
    <GameContext.Provider value={value}>
      { value.isLoading 
        ? <h1>Loading…</h1> 
        : (<>
            <Outlet />
            <Setup {...value}/>
          </>)
      }
    </GameContext.Provider>
  )
}


export {
  GameContext,
  GameProvider,
}
