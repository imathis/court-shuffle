import React from 'react'
import { allCourts, sort } from '../helpers'

import './setup.css'
import { QrCode } from './qrCode'
import { Transition } from './Transition'
import { Icon } from './Icon'

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
    <div className="setup-section">
      <input className="player-count" disabled={!max} type="number" min={3} max={max} defaultValue={players.length} ref={playersRef} /> 
      <h2 className="setup-title">Players</h2>
      <div className="setup-players">
        <button aria-label="remove a player" className="adjust-players" disabled={!max} onClick={removePlayer}><Icon name="minus" height="1em" /></button>
        <div style={{opacity: !max ? 0.5 : 1 }} className="setup-players-number">{ players }</div>
        <button aria-label="add a player" className="adjust-players" disabled={!max} onClick={addPlayer}><Icon name="plus" height="1em" /></button>
      </div>
    </div>
  )
}

const Share = ({ url }) => {
  return (
    <div className="setup-section">
      <h2 className="setup-title">Invite</h2>
      <div className="share-code">
        <p className="setup-text">Draw cards from multiple devices</p>
        <QrCode url={url} />
      </div>
    </div>
  )
}

const Setup = ({ game, inProgress, setup, configVisible, closeConfig, url }) => {
  const [courts, setCourts] = React.useState(game?.courts || [])
  const [players, setPlayers] = React.useState(game?.players)
  const [perCourt, setPerCourt] = React.useState(game?.perCourt || 4)
  const maxPlayers = (courts.length * perCourt) + courts.length

  const setupGame = async () => {
    const newRound = async () => {
      await setup({ perCourt, courts, players })
      closeConfig()
    }
    if (inProgress) {
      if(window.confirm('There is a round in progress. Begin a new round with these settings?')) { newRound() } else { closeConfig() }
    } else newRound()
  }

  React.useEffect(() => {
    const defaultPlayers = courts.length * perCourt
    setPlayers(defaultPlayers)
  }, [courts, perCourt])

  return (
    <>
      <Transition
        type="slide-panel"
        in={configVisible}
        unmountOnExit
      >
        <div className="setup-screen">
          <div className="setup-actions">
            { game?.cards ? <button className="setup-action" onClick={closeConfig}>Close</button> : <span /> }
            <button className="setup-action primary" onClick={setupGame} disabled={!courts.length}>Save</button>
          </div>
          <div className="setup-settings">
            <Format perCourt={perCourt} update={setPerCourt} />
            <Courts courts={courts} update={setCourts} />
            <Players players={players} update={setPlayers} max={maxPlayers} />
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
        <div className="setup-screen-backdrop" />
      </Transition>
    </>
 )
}

export { Setup }
