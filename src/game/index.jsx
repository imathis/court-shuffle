import { Link } from 'react-router-dom'

export const GameIndex = () => (
  <div>
    <Link to="new">New Game</Link>
    <Link to="join">Join Game</Link>
  </div>
)

export { NewGame } from './new'
export { Setup } from './setup'
export { Join } from './join'
export { Play } from './play'
