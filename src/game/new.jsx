import React from 'react'
import { Navigate } from 'react-router-dom'
import { useMutation } from "../../convex/_generated/react";

const NewGame = () => {
  const create = useMutation("game:create")
  const [slug, setSlug] = React.useState()

  React.useEffect(() => {
    const createGame = async () => {
      const gameSlug = await create()
      setSlug(gameSlug)
    }
    createGame()
  }, [create])

  if (slug) {
    return <Navigate to={`/game/${slug}`} />
  }
  return <h1>Loading…</h1>
}

export { NewGame }
