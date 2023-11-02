import React from 'react'
import { Navigate } from 'react-router-dom'
import { useMutation } from 'convex/react';

const NewGame = () => {
  const create = useMutation("game:create")
  const [slug, setSlug] = React.useState()

  React.useEffect(() => {
    if (!slug) {
      (async () => {
        const game = await create()
        setSlug(game.slug)
      })()
    }
  }, [slug, create])

  if (slug) {
    return <Navigate to={`/game/${slug}`} />
  }
  return <h1>Loading…</h1>
}

export { NewGame }
