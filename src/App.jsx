import "./App.css";
import React from 'react'
import { useQuery, useMutation } from "../convex/_generated/react";

function App() {
  const [slug, setSlug] = React.useState("UN4HE")
  const [currentCard, setCurrentCard] = React.useState('')
  const game = useQuery("getGame", { slug });
  const createGame = useMutation("createGame");
  const drawCard = useMutation("drawCard");
  const resetGame = useMutation("resetGame")

  const startGame = React.useCallback(async () => {
    const gameSlug = await createGame({ courts: ['2','3'], players: 7 })
    if (gameSlug) {
      setSlug(gameSlug)
    }
  }, [createGame])

  const draw = React.useCallback(async () => {
    const card = await drawCard({ game })
    if (card) {
      setCurrentCard(card)
    }
  }, [drawCard, game])

  const reset = React.useCallback(async () => {
    resetGame({ game, players: 9 })
  }, [resetGame, game])

  if (!slug) {
    return (
      <div className="App">
        <button onClick={startGame}>New Game</button>
      </div>
    )
  }
  if (game) {
    const { slug, courts, players } = game
    return (
      <div className="App">
        <div>Slug: { slug }</div>
        <div>Courts: { courts.join(', ') }</div>
        <div>Players: { players }</div>
        <div>Your Card: {currentCard.court}{ currentCard.suit }</div>
        <button onClick={draw}>DrawCard</button>
        <button onClick={reset}>Reset Game</button>
      </div>
    )
  } else {
    return (
      <div className="App">
        Game Not Found
      </div>
    )
  }
}

export default App;
