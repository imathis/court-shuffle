import React from 'react'
import { useQuery, useMutation } from "../../convex/_generated/react";
import { useParams, Outlet } from 'react-router-dom'

const GameContext = React.createContext({})

const useGameHooks = () => {
  const { game: slug } = useParams()
  const [currentCard, setCurrentCard] = React.useState()
  const setupGame = useMutation("game:setup")
  const drawCard = useMutation("game:draw")
  const create = useMutation("game:create")
  const game = useQuery("game:get", { slug });

  const draw = React.useCallback(async () => {
    const card = await drawCard({ slug })
    if (card) setCurrentCard(card)
  }, [slug, drawCard])

  const setup = React.useCallback(async (props = {}) => {
    await setupGame({ slug, ...props })
    setCurrentCard(null)
  }, [slug, setupGame])

  React.useEffect(() => {
    if (game?.lastDrawn === -1) setCurrentCard(null)
  }, [game])

  return React.useMemo(() => ({
    game,
    slug,
    create,
    setup,
    draw,
    currentCard,
    reset: () => setup(),
    isComplete: game && game.lastDrawn + 1 === game?.cards?.length,
    isLoading: typeof game === 'undefined',
    notFound: game === null,
  }), [create, slug, currentCard, draw, game, setup])
}

const GameProvider = () => {
  const value = useGameHooks()
  return (
    <GameContext.Provider value={value}>
      { value.isLoading 
        ? <h1>Loading…</h1> 
        : <Outlet /> 
      }
    </GameContext.Provider>
  )
}


export {
  GameContext,
  GameProvider,
}
