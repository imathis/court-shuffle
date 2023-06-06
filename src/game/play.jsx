import React from 'react'
import { useGame } from '../hooks'
import { Navigate } from 'react-router-dom'
import {
  Card, NextRound, Draw, CourtAssignment, CardNav,
} from './card'

import "./play.css"


const suitType = {
  spades: 'black',
  clubs: 'black',
  diamonds: 'red',
  hearts: 'red',
  joker: 'purple',
} 

const Play = () => {
  const { game, isDrawing, draw, previous, next, drawn, openConfig, reset, inProgress, roundOver } = useGame()
  const [showNextRound, setShowNextRound] = React.useState(false)
  const card = drawn.card

  const nextRound = () => {
    setShowNextRound(false) 
    reset()
  }

  // When new (in progress) game is loaded, or game is restarted resest state
  React.useEffect(() => {
    if (inProgress && !card) { setShowNextRound(false) }
  }, [inProgress, card])

  React.useEffect(() => {
    if (game && !game.cards) { openConfig() }
  }, [game, openConfig])

  // When round ends, show next round and settings buttons
  React.useEffect(() => {
    if (roundOver && !inProgress) setTimeout(() => setShowNextRound(true), card ? 1400 : 0)  
  }, [roundOver, inProgress, card])

  // Bad URL, there is no game here
  if (!game) return <Navigate to="join" />



  // You have no card to display but the round is still going
  /* if (!card && inProgress) { */
  /*   return <button className="card-draw-button" onClick={drawCard} disabled={drawing}>Draw</button>   */
  /* } */

  // You are drawing cards
  return (
    <div className="play-screen" data-suit={suitType[card?.suit]} data-round-over={showNextRound || null}>
      <div className="court-play">
        { showNextRound ? <NextRound nextRound={nextRound} openConfig={openConfig} /> : null }
        { card ? <Card {...card} /> : null }
        <div className="court-info">
          <Draw draw={draw} drawing={isDrawing} inProgress={inProgress} />
          { card ? <CourtAssignment {...card} /> : null }
          <CardNav next={next} back={previous} openConfig={openConfig} />
        </div>
      </div>
    </div>
  )
}

export { Play }
