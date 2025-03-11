import React from "react";
import { allCourts, sort } from "../helpers";

import "./config.css";
import { QrCode } from "./qrCode";
import { Transition } from "./Transition";
import { Icon } from "./Icon";
import { useGameStore } from "../store/gameStore";

const Format = ({ perCourt, update }) => {
  return (
    <div className="config-section">
      <h2 className="config-title">
        {perCourt ? "Format" : "Choose a Format"}
      </h2>
      <div className="config-format">
        <button
          className="config-button"
          data-selected={perCourt === 2 || null}
          onClick={() => update(2)}
        >
          Singles
        </button>
        <button
          className="config-button"
          data-selected={perCourt === 4 || null}
          onClick={() => update(4)}
        >
          Doubles
        </button>
      </div>
    </div>
  );
};

const Courts = ({ courts, update }) => {
  const toggleCourt = React.useCallback(
    ({ target }) => {
      let newCourts = [...courts];
      const value = Number.parseInt(target.value, 10);
      if (target.checked) {
        newCourts.push(value);
      } else {
        newCourts = newCourts.filter((c) => c !== value);
      }
      update(newCourts.sort(sort));
    },
    [update, courts],
  );

  return (
    <div className="config-section">
      <h2 className="config-title">
        {courts.length ? "Courts" : "Select Courts"}
      </h2>
      <div className="config-courts">
        {Array(13)
          .fill(1)
          .map((_court, index) => (
            <label
              key={allCourts[index]}
              className="config-checkbutton"
              data-selected={courts.includes(allCourts[index + 1]) || null}
            >
              <input
                name={`court${index + 1}`}
                type="checkbox"
                onChange={toggleCourt}
                checked={courts.includes(allCourts[index + 1])}
                value={allCourts[index + 1]}
              />
              {index + 1}
            </label>
          ))}
      </div>
    </div>
  );
};

const Players = ({ players, max, update }) => {
  const playersRef = React.useRef();
  const updatePlayers = (value) => {
    playersRef.current.value = value;
    update(Number.parseInt(value, 10));
  };

  const currentValue = () => {
    return playersRef.current
      ? Number.parseInt(playersRef.current.value)
      : null;
  };

  const addPlayer = () => {
    let value = currentValue();
    if (value && value < max) {
      updatePlayers(value + 1);
    }
  };
  const removePlayer = () => {
    let value = currentValue();
    if (value && value > 3) {
      updatePlayers(value - 1);
    }
  };
  React.useEffect(() => {
    if (playersRef.current) playersRef.current.value = players;
  }, [players]);

  return (
    <div className="config-section">
      <input
        className="player-count"
        disabled={!max}
        type="number"
        min={3}
        max={max}
        defaultValue={players?.length}
        ref={playersRef}
      />
      <h2 className="config-title">Players</h2>
      <div className="config-players">
        <button
          aria-label="remove a player"
          className="adjust-players"
          disabled={!max}
          onClick={removePlayer}
        >
          <Icon name="minus" height="1em" />
        </button>
        <div
          style={{ opacity: !max ? 0.5 : 1 }}
          className="config-players-number"
        >
          {players}
        </div>
        <button
          aria-label="add a player"
          className="adjust-players"
          disabled={!max}
          onClick={addPlayer}
        >
          <Icon name="plus" height="1em" />
        </button>
      </div>
    </div>
  );
};

const Share = ({ url, enableSync }) => {
  return (
    <div className="config-section">
      <h2 className="config-title">Invite</h2>
      <div className="share-code">
        <p className="config-text">Draw cards from multiple devices</p>
        {url ? (
          <QrCode url={url} />
        ) : (
          <button className="config-action secondary" onClick={enableSync}>
            Share Deck
          </button>
        )}
      </div>
    </div>
  );
};

const removeEmptyCourts = ({ courts, perCourt, players }) => {
  const lessPlayers = courts.length * perCourt - players;
  const remove = Math.floor(lessPlayers / perCourt);
  return courts.slice(0, courts.length - remove);
};

const Config = () => {
  const { gameStore, setGameConfig, enableSync } = useGameStore();
  const game = gameStore((state) => state.game);
  const setConfigVisible = gameStore((state) => state.setConfigVisible);
  const configVisible = gameStore((state) => state.configVisible);
  const getUrl = gameStore((state) => state.getUrl);
  const inProgress = gameStore((state) => state.getInProgress)();

  const [courts, setCourts] = React.useState(game?.courts || []);
  const [players, setPlayers] = React.useState(game?.players);
  const [perCourt, setPerCourt] = React.useState(game?.perCourt);
  const maxPlayers = courts.length * perCourt + (perCourt - 1);

  const configGame = async () => {
    const newRound = async () => {
      await setGameConfig({ perCourt, courts, players });
      setConfigVisible(false);
    };
    if (inProgress) {
      if (
        window.confirm(
          "There is a round in progress. Begin a new round with these settings?",
        )
      ) {
        newRound();
      } else {
        setConfigVisible(false);
      }
    } else newRound();
  };

  const updateCourts = (c) => {
    setCourts(c);
    const defaultPlayers = c.length * perCourt;
    setPlayers(defaultPlayers);
  };

  const updatePlayers = (p) => {
    setPlayers(p);
    const c = removeEmptyCourts({ players: p, courts, perCourt });
    if (c.length !== courts.length) setCourts(c);
  };

  const updatePerCourt = (count) => {
    setPerCourt(count);
    const defaultPlayers = courts.length * count;
    setPlayers(defaultPlayers);
  };

  return (
    <>
      <Transition type="slide-panel" in={configVisible} unmountOnExit>
        <div className="config-screen">
          <div className="config-actions">
            <button
              className="config-action"
              onClick={() => setConfigVisible(false)}
            >
              Close
            </button>
            {perCourt && players ? (
              <button
                className="config-action config-primary"
                onClick={configGame}
                disabled={!courts.length}
              >
                Save
              </button>
            ) : null}
          </div>
          <div className="config-settings">
            <Format perCourt={perCourt} update={updatePerCourt} />
            {perCourt ? <Courts courts={courts} update={updateCourts} /> : null}
            {courts.length ? (
              <>
                <Players
                  players={players}
                  update={updatePlayers}
                  max={maxPlayers}
                />
                <Share url={getUrl()} enableSync={enableSync} />
              </>
            ) : null}
          </div>
        </div>
      </Transition>
      <Transition type="fade" in={configVisible} unmountOnExit timeout={300}>
        <div className="config-screen-backdrop" />
      </Transition>
    </>
  );
};

export { Config };
