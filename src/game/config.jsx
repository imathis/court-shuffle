import React from 'react'
import { allCourts, sort } from '../helpers'

import './config.css'
import { QrCode } from './qrCode'
import { Transition } from './Transition'
import { Icon } from './Icon'

const Format = ({ perCourt, update }) => {
  return (
    <div className="config-section">
      <h2 className="config-title">Format</h2>
      <div className="config-format">
        <button className="config-button" data-selected={perCourt===2 || null} onClick={() => update(2)}>Singles</button>
        <button className="config-button" data-selected={perCourt===4 || null} onClick={() => update(4)}>Doubles</button>
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
    <div className="config-section">
      <h2 className="config-title">{ courts.length ? 'Courts' : 'Select Courts'}</h2>
      <div className="config-courts">
        { Array(13).fill(1).map((_court, index) => (
          <label 
            key={allCourts[index]}
            className="config-checkbutton"
            data-selected={courts.includes(allCourts[index]) || null}
          >
            <input 
              name={`court${index+1}`}
              type="checkbox"
              onChange={toggleCourt}
              checked={courts.includes(allCourts[index])}
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
  const updatePlayers = (value) => {
    playersRef.current.value = value
    update(Number.parseInt(value, 10))
  }

  const currentValue = () => {
    return (playersRef.current) ? Number.parseInt(playersRef.current.value) : null
  }

  const addPlayer = () => {
    let value = currentValue()
    if (value && value < max) {
      updatePlayers(value + 1)
    }
  }
  const removePlayer = () => {
    let value = currentValue()
    if (value && value > 3) {
      updatePlayers(value - 1)
    }
  }
  React.useEffect(() => {
    if (playersRef.current) playersRef.current.value = players
  }, [players])

  return (
    <div className="config-section">
      <input className="player-count" disabled={!max} type="number" min={3} max={max} defaultValue={players?.length} ref={playersRef} /> 
      <h2 className="config-title">Players</h2>
      <div className="config-players">
        <button aria-label="remove a player" className="adjust-players" disabled={!max} onClick={removePlayer}><Icon name="minus" height="1em" /></button>
        <div style={{opacity: !max ? 0.5 : 1 }} className="config-players-number">{ players }</div>
        <button aria-label="add a player" className="adjust-players" disabled={!max} onClick={addPlayer}><Icon name="plus" height="1em" /></button>
      </div>
    </div>
  )
}

const Share = ({ url }) => {
  return (
    <div className="config-section">
      <h2 className="config-title">Invite</h2>
      <div className="share-code">
        <p className="config-text">Draw cards from multiple devices</p>
        <QrCode url={url} />
      </div>
    </div>
  )
}

const removeEmptyCourts = ({ courts, perCourt, players }) => {
  const lessPlayers = (courts.length * perCourt) - players
  const remove = Math.floor(lessPlayers / perCourt)
  return courts.slice(0, courts.length - remove)
}

const Config = ({ game, inProgress, config, configVisible, closeConfig, url }) => {
  const [courts, setCourts] = React.useState(game?.courts || [])
  const [players, setPlayers] = React.useState(game?.players)
  const [perCourt, setPerCourt] = React.useState(game?.perCourt || 4)
  const maxPlayers = (courts.length * perCourt) + (perCourt - 1)

  const configGame = async () => {
    const newRound = async () => {
      await config({ perCourt, courts, players })
      closeConfig()
    }
    if (inProgress) {
      if(window.confirm('There is a round in progress. Begin a new round with these settings?')) { newRound() } else { closeConfig() }
    } else newRound()
  }

  const updateCourts = (c) => {
    setCourts(c)
    const defaultPlayers = c.length * perCourt
    setPlayers(defaultPlayers)
  }

  const updatePlayers = (p) => {
    setPlayers(p)
    const c = removeEmptyCourts({ players: p, courts, perCourt })
    if (c.length !== courts.length) setCourts(c)
  }

  const updatePerCourt = (count) => {
    setPerCourt(count)
    const defaultPlayers = courts.length * count
    setPlayers(defaultPlayers)
  }

  return (
    <> <Transition
        type="slide-panel"
        in={configVisible}
        unmountOnExit
      >
        <div className="config-screen">
          <div className="config-actions">
            { game?.cards ? <button className="config-action" onClick={closeConfig}>Close</button> : <span /> }
            <button className="config-action primary" onClick={configGame} disabled={!courts.length}>Save</button>
          </div>
          <div className="config-settings">
            <Format perCourt={perCourt} update={updatePerCourt} />
            <Courts courts={courts} update={updateCourts} />
            <Players players={players} update={updatePlayers} max={maxPlayers} />
            <Share url={url} />
          </div>
        </div>
      </Transition>
      <Transition
        type="fade"
        in={configVisible}
        unmountOnExit
        timeout={800}
      >
        <div className="config-screen-backdrop" />
      </Transition>
    </>
 )
}

export { Config }
