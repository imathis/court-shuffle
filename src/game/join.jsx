import React from 'react'
import PropTypes from 'prop-types'

import { Navigate, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks'

const Join = () => {
  const { game, slug } = useGame()
  const navigate = useNavigate()
  const slugRef = React.useRef()

  if (game) {
    return <Navigate to="../setup" />
  }
  return (
    <div className="App">
      { slug ? (
        <div>
          <h1>Game Not Found</h1>
          <p>You may have entered a game code in wrong.</p>
        </div>
      ) : (
        <div>
          <h1>Enter Game Code</h1>
          <p>Join a game by entering its code.</p>
        </div>
      )}
      <p>
        <label>
          Game Code
          <input type="text" defaultValue={slug} ref={slugRef} />
        </label>
      </p>
      <p>
        <button onClick={ () => navigate(`/game/${slugRef.current.value.toUpperCase()}/join`) }>Join Game</button>
      </p>
    </div>
  )
}

Join.propTypes = {
  slug: PropTypes.string,
}

Join.defaultProps = {
  slug: undefined,
}

export { Join }
