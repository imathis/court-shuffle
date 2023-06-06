import React from 'react'
import { useQuery, useMutation } from "../../convex/_generated/react";
import { useParams, Outlet } from 'react-router-dom'
import { Setup } from '../game/setup'

const GameContext = React.createContext({})

const useGameHooks = () => {
  const { game: slug } = useParams()
  const [currentCard, setCurrentCard] = React.useState()
  const setupGame = useMutation("game:setup")
  const drawCard = useMutation("game:draw")
  const create = useMutation("game:create")
  const game = useQuery("game:get", { slug });
  const [configVisible, setConfigVisible] = React.useState(false)

  const openConfig = React.useCallback(() => setConfigVisible(true), [])
  const closeConfig = React.useCallback(() => setConfigVisible(false), [])

  const draw = React.useCallback(async () => {
    const card = await drawCard({ slug })
    if (card) setCurrentCard(card)
    return card
  }, [slug, drawCard])

  const setup = React.useCallback(async (props = {}) => {
    await setupGame({ slug, ...props })
    setCurrentCard(null)
  }, [slug, setupGame])

  React.useEffect(() => {
    if (game?.lastDrawn === -1) setCurrentCard(null)
  }, [game])

  const roundOver = game && game.lastDrawn + 1 === game?.cards?.length;
  const inProgress = game && game.cards.length && !roundOver

  return React.useMemo(() => ({
    game,
    slug,
    create,
    setup,
    draw,
    currentCard: currentCard?.card,
    currentCardIndex: currentCard?.index,
    url: `https://courtshuffle.com/game/${slug}`,
    reset: () => setup(),
    roundOver,
    inProgress,
    isLoading: typeof game === 'undefined',
    notFound: game === null,
    configVisible,
    openConfig,
    closeConfig,
  }), [create, slug, currentCard, draw, game, setup, configVisible, openConfig, closeConfig, inProgress, roundOver])
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
