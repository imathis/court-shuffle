import React from 'react'
import { useGame } from '../hooks'
import { Navigate } from 'react-router-dom'
import { Card } from './card'

import "./play.css"


const suitType = {
  spades: 'black',
  clubs: 'black',
  diamonds: 'red',
  hearts: 'red',
  joker: 'purple',
} 

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

const Play = () => {
  const { game, currentCard, draw, openConfig, reset, inProgress, roundOver } = useGame()
  const [currentDeck, updateDeck] = React.useReducer(reduceDeck, { cards: [], index: -1 })
  const [drawing, setDrawing] = React.useState(false)
  const [showNextRound, setShowNextRound] = React.useState(false)
  const card = currentDeck.card

  React.useEffect(() => {
    if (currentCard) {
      setDrawing(true)
      setTimeout(() => setDrawing(false), 800)
      updateDeck({ card: currentCard })
    } else {
      updateDeck('reset')
    }
  }, [currentCard])

  React.useEffect(() => {
    if (roundOver && currentCard) {
      setDrawing(false)
      setTimeout(() => setShowNextRound(true), 800)
    }
  }, [currentCard, reset, roundOver])

  const drawCard = () => {
    setDrawing(true)
    draw()
  }

  const nextRound = () => {
    setShowNextRound(false)
    reset()
  }

  React.useEffect(() => {
    if (game && !game.cards) { openConfig() }
  }, [game, openConfig])

  const back = currentDeck.index >= 1 ? () => updateDeck('back') : null
  const next = currentDeck.index + 1 < currentDeck.cards.length ? () => updateDeck('next') : null

  // Bad URL, there is no game here
  if (!game) return <Navigate to="join" />

  // The round has ended, you have no card to display
  if (roundOver && !card) {
    return <button onClick={openConfig}>Config</button>
  }

  // You have no card to display but the round is still going
  if (!card && inProgress) {
    return <button className="card-draw-button" onClick={drawCard} disabled={drawing}>Draw</button>  
  }

  // You are drawing cards
  return (
    <div className="play-screen" data-suit={suitType[card?.suit]} data-round-over={showNextRound || null}>
      <Card inProgress={inProgress} draw={drawCard} drawing={drawing} openConfig={openConfig} card={card} back={back} next={next} nextRound={showNextRound ? nextRound : null} />
    </div>
  )
}

export { Play }
