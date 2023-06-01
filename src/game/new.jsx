import React from 'react'
import { useGame } from '../hooks'
import { Navigate } from 'react-router-dom'

const NewGame = () => {
  const { create, game, slug } = useGame()

  React.useEffect(() => {
    create()
  }, [create])

  if (game) {
    return <Navigate to={`../${slug}/setup`} />
  }
  return <h1>Loading…</h1>
}

export { NewGame }
