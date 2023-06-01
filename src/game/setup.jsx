import React from 'react'
import { allCourts } from '../helpers'
import { useGame } from '../hooks'

const Setup = () => {
  const { game, setup } = useGame()
  const [courts, setCourts] = React.useState(game?.courts || [])
  const [players, setPlayers] = React.useState(game?.players)
  const [perCourt, setPerCourt] = React.useState(game?.perCourt || 4)
  const playersRef = React.useRef()
  const perCourtRef = React.useRef()

  const toggleCourt = React.useCallback(({ target }) => {
    let newCourts = [...courts]
    if (target.checked) {
      newCourts.push(target.value)
    } else {
      newCourts = newCourts.filter((c) => c !== target.value)
    }
    setCourts(newCourts)
    console.log(newCourts)
    const defaultPlayers = newCourts.length ? newCourts.length * perCourt : perCourt
    console.log(defaultPlayers)
    setPlayers(defaultPlayers)
  }, [courts, perCourt])

  const updatePlayers = ({ target }) => {
    setPlayers(Number.parseInt(target.value, 10))
  }

  const updatePerCourt = ({ target }) => {
    setPerCourt(Number.parseInt(target.value, 10))
  }

  const setupGame = () => {
    setup({ perCourt, courts, players })
  }

  React.useEffect(() => {
    if (playersRef.current) {
      playersRef.current.value = players
    }
  }, [playersRef, players])
  
  return (
    <div>
      <h1>Per Court Default</h1>
      <div>
        <input type="range" min={2} max={4} defaultValue={4} ref={perCourtRef} onChange={updatePerCourt} /> 
        { perCourt }
      </div>
      <h1>Select Courts</h1>
      { Array(13).fill(1).map((_court, index) => (
        <label key={allCourts[index]}>
          <input 
            type="checkbox"
            onChange={toggleCourt}
            defaultChecked={courts.includes(allCourts[index])}
            value={allCourts[index]}
          />
          {index + 1}
        </label>
      ))}
      { courts.length 
        ? (
        <div>
          <h2>Select Players</h2>
          <div>
            <input type="range" min={3} max={(courts.length * perCourt) + courts.length} defaultValue={players.length} ref={playersRef} onChange={updatePlayers} /> 
            { players }
          </div>
          <div>
            <button onClick={setupGame}>Setup Game</button>
          </div>
        </div>
          )
        : null }
    </div>
  )
  
}

export { Setup }
