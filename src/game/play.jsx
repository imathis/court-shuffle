import { useGame } from '../hooks'
import { Navigate } from 'react-router-dom'

const Play = () => {
  const { game, currentCard, draw, reset, isComplete } = useGame()

  if (!game) return <Navigate to="join" />
  return (
    <div className="App">
      { currentCard ? (
        <h1>{currentCard.court}{currentCard.suit}</h1>
      ) : null }
      <p>
        <button onClick={draw} disabled={isComplete}>Draw a Card</button>
      </p>
      { isComplete ? (
        <p>
          <button onClick={reset}>Reset Game</button>
        </p>
      ) : null }
    </div>
  )
}

export { Play }
