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

const Play = () => {
  const { game, currentCard, draw, reset, isComplete } = useGame()

  if (!game) return <Navigate to="join" />
  const courtActions = (
      <div className="court-actions">
        <button onClick={draw} disabled={isComplete}>Draw a Card</button>
        { isComplete ? (
          <button className onClick={reset}>Reset Game</button>
        ) : null }
      </div>
  )
  return (
    <div className="play-screen" data-suit={suitType[currentCard?.suit]}>
      { currentCard ? (
        <Card {...currentCard}>
          {courtActions}
        </Card>
      ) : courtActions }
    </div>
  )
}

export { Play }
