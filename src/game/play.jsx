import React from "react";
import {
  Card,
  NextRound,
  Draw,
  CourtAssignment,
  CardNav,
  CourtStatus,
} from "./card";
import { Icon } from "./Icon";
import { useGameStore } from "../store/gameStore";
import { Config } from "../game/config";

import "./play.css";
import { preloadCards } from "../assets/cards";

const suitType = {
  spades: "black",
  clubs: "black",
  diamonds: "red",
  hearts: "red",
  joker: "purple",
};

const NewGameInstructions = ({ openConfig }) => (
  <>
    <div className="instructions-text">
      <h2>Before you start</h2>
      <ol>
        <li>Choose a format</li>
        <li>Select courts</li>
        <li>Adjust players</li>
      </ol>
    </div>
    <button className="primary" onClick={openConfig}>
      Court Settings
    </button>
  </>
);

const Instructions = ({ text, card }) => (
  <div className="instructions" data-subtle={!!card || null}>
    <div className="logo-banner">
      <Icon name="club" />
      <Icon name="logo" />
    </div>
    {text}
  </div>
);

const getFormat = ({ card, cards }) => {
  if (!card) return null;
  const onCourt = cards.filter(({ court }) => court === card.court).length;
  if (onCourt === 1) return "ROTATION";
  if (onCourt === 2) return "SINGLES";
  if (onCourt === 3) return "3 PLAYER";
  return null;
};

const Play = () => {
  const { gameStore, setGameConfig, drawCard } = useGameStore();
  const game = gameStore((state) => state.game);
  const card = gameStore((state) => state.currentCard);
  const isDrawing = gameStore((state) => state.isDrawing);
  const drawnIndex = gameStore((state) => state.drawnIndex);
  const getNavigation = gameStore((state) => state.getNavigation);
  const setConfigVisible = gameStore((state) => state.setConfigVisible);

  const roundOver = gameStore((state) => state.getRoundOver)();
  const inProgress = gameStore((state) => state.getInProgress)();
  const [showNextRound, setShowNextRound] = React.useState(false);
  console.log({ card, inProgress });

  const nextRound = () => {
    setShowNextRound(false);
    setGameConfig();
  };

  React.useEffect(() => {
    preloadCards({ cards: game?.courts });
  }, [game?.courts]);

  // When new (in progress) game is loaded, or game is restarted resest state
  React.useEffect(() => {
    if (inProgress && !card) {
      setShowNextRound(false);
    }
  }, [inProgress, card]);

  // When round ends, show next round and settings buttons
  React.useEffect(() => {
    if (roundOver && !inProgress)
      setTimeout(() => setShowNextRound(true), card ? 1400 : 0);
  }, [roundOver, inProgress, card]);

  if (!game?.cards) {
    return (
      <div
        className="play-screen"
        data-suit={suitType[card?.suit]}
        data-round-over={showNextRound || null}
      >
        <div className="court-play">
          <Instructions
            card={card}
            text={
              !game?.cards ? (
                <NewGameInstructions
                  openConfig={() => setConfigVisible(true)}
                />
              ) : null
            }
          />
        </div>
      </div>
    );
  }

  // You are drawing cards
  return (
    <>
      <div
        className="play-screen"
        data-suit={suitType[card?.suit]}
        data-round-over={showNextRound || null}
      >
        <div className="court-play">
          {showNextRound ? (
            <NextRound
              nextRound={nextRound}
              openConfig={() => setConfigVisible(true)}
            />
          ) : null}
          <Instructions card={card} index={drawnIndex} />
          {card ? <Card {...card} index={drawnIndex} /> : null}
          <div className="court-info">
            <Draw draw={drawCard} drawing={isDrawing} inProgress={inProgress} />
            <CourtAssignment
              format={getFormat({ card, cards: game.cards })}
              {...card}
            />
            {inProgress ? (
              <CourtStatus index={drawnIndex} players={game.players} />
            ) : null}
            <CardNav
              getNavigation={getNavigation}
              openConfig={() => setConfigVisible(true)}
            />
          </div>
        </div>
      </div>
      <Config />
    </>
  );
};

export { Play };
