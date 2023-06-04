import React from 'react'
import { allCourts, sort } from '../helpers'
import { useGame } from '../hooks'

import './setup.css'

const Format = ({ perCourt, update }) => {
  return (
    <div className="setup-section">
      <h2 className="setup-title">Format</h2>
      <div className="setup-format">
        <button className="setup-button" data-selected={perCourt===2 || null} onClick={() => update(2)}>Singles</button>
        <button className="setup-button" data-selected={perCourt===4 || null} onClick={() => update(4)}>Doubles</button>
      </div>
    </div>
  )
}

const Courts = ({ courts, update }) => {
  const toggleCourt = React.useCallback(({ target }) => {
    let newCourts = [...courts]
    const value = Number.parseInt(target.value, 10)
    if (target.checked) {
      newCourts.push(value)
    } else {
      newCourts = newCourts.filter((c) => c !== value)
    }
    update(newCourts.sort(sort))
  }, [update, courts])

  return (
    <div className="setup-section">
      <h2 className="setup-title">{ courts.length ? 'Courts' : 'Select Courts'}</h2>
      <div className="setup-courts">
        { Array(13).fill(1).map((_court, index) => (
          <label 
            key={allCourts[index]}
            className="setup-checkbutton"
            data-selected={courts.includes(allCourts[index]) || null}
          >
            <input 
              type="checkbox"
              onChange={toggleCourt}
              defaultChecked={courts.includes(allCourts[index])}
              value={allCourts[index]}
            />
            {index + 1}
          </label>
        ))}
      </div>
    </div>
  )
}

const Players = ({ players, max, update }) => {
  const playersRef = React.useRef()
  const updatePlayers = React.useCallback(({ target }) => {
    update(Number.parseInt(target.value, 10))
  }, [update])

  React.useEffect(() => {
    if (playersRef.current) playersRef.current.value = players
  }, [players])

  return (
    <div className="setup-section">
      <h2 className="setup-title">Players</h2>
      <div className="setup-players">
        <input type="range" min={3} max={max} defaultValue={players.length} ref={playersRef} onChange={updatePlayers} /> 
        <div className="setup-players-number">{ players }</div>
      </div>
    </div>
  )
}

const Setup = () => {
  const { game, setup } = useGame()
  const [courts, setCourts] = React.useState(game?.courts || [])
  const [players, setPlayers] = React.useState(game?.players)
  const [perCourt, setPerCourt] = React.useState(game?.perCourt || 4)
  const maxPlayers = (courts.length * perCourt) + courts.length

  const setupGame = () => {
    setup({ perCourt, courts, players })
  }

  React.useEffect(() => {
    const defaultPlayers = courts.length * perCourt
    setPlayers(defaultPlayers)
  }, [courts, perCourt])

  return (
    <div className='setup-screen'>
      <div className="setup-actions">
        <button className="setup-action" onClick={null}>Back</button>
        <button className="setup-action" onClick={setupGame} disabled={!courts.length}>Save</button>
      </div>
      <div className="setup-settings">
        <Format perCourt={perCourt} update={setPerCourt} />
        <Courts courts={courts} update={setCourts} />
        <Players players={players} update={setPlayers} max={maxPlayers} />
      </div>
    </div>
  )
  
}

export { Setup }
