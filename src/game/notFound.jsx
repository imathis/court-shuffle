import React from 'react'
import { useGame } from '../hooks'
import { Navigate, useNavigate } from 'react-router-dom'

const GameNotFound = () => {
  const { slug, game } = useGame()
  const navigate = useNavigate()
  const slugRef = React.useRef()

  if (game) {
    return <Navigate to="setup" />
  }

  return (
    <div className="App">
      <h1>Game Not Found</h1>
      <p>You may have entered a game code in wrong</p>
      <p>
        <label>
          Game Code
          <input type="text" defaultValue={slug} ref={slugRef} />
        </label>
      </p>
      <p>
        <button onClick={ () => navigate(slugRef.current.value) }>Join Game</button>
      </p>
    </div>
  )
}

export { GameNotFound }
