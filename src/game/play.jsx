import React from 'react'
import { useGame } from '../hooks'
import { Navigate } from 'react-router-dom'
import {
  Card, NextRound, Draw, CourtAssignment, CardNav, CourtStatus,
} from './card'
import { Icon } from './Icon'

import "./play.css"


const suitType = {
  spades: 'black',
  clubs: 'black',
  diamonds: 'red',
  hearts: 'red',
  joker: 'purple',
} 

const NewGameInstructions = ({ openConfig }) => (
  <>
    <div className="instructions-text">
      <h2>Before you start</h2>
      <ol>
        <li>Choose a format</li>
        <li>Select courts</li>
        <li>Adjust players</li>
      </ol>
    </div>
    <button className="primary" onClick={openConfig}>Court Settings</button>
  </>
)

const Instructions = ({ text, card }) => (
  <div className="instructions" data-subtle={!!card || null}>
    <div className="logo-banner">
      <Icon name="club" />
      <Icon name="logo" />
    </div>
    { text }
  </div>
)

const Play = () => {
  const { game, isDrawing, draw, previous, next, drawn, openConfig, reset, inProgress, roundOver, cardsRemaining } = useGame()
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

  // When round ends, show next round and settings buttons
  React.useEffect(() => {
    if (roundOver && !inProgress) setTimeout(() => setShowNextRound(true), card ? 1400 : 0)  
  }, [roundOver, inProgress, card])

  // Bad URL, there is no game here
  if (!game) return <Navigate to="join" />

  if (!game?.cards) {
    return (
      <div className="play-screen" data-suit={suitType[card?.suit]} data-round-over={showNextRound || null}>
        <div className="court-play">
          <Instructions card={card} text={!game?.cards ? <NewGameInstructions openConfig={openConfig} /> : null} />
        </div>
      </div>
    )
  }

  // You are drawing cards
  return (
    <div className="play-screen" data-suit={suitType[card?.suit]} data-round-over={showNextRound || null}>
      <div className="court-play">
        { showNextRound ? <NextRound nextRound={nextRound} openConfig={openConfig} /> : null }
        <Instructions card={card} index={drawn.index} />
        { card ? <Card {...card} index={drawn.index} /> : null }
        <div className="court-info">
          <Draw draw={draw} drawing={isDrawing} inProgress={inProgress} />
          <CourtAssignment format={drawn.format} {...card} />
          { inProgress ? <CourtStatus drawn={drawn} players={game.players} /> : null }
          <CardNav next={next} back={previous} openConfig={openConfig} />
        </div>
      </div>
    </div>
  )
}

export { Play }
