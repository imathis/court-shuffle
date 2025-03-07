import "./card.css";
import React from "react";
import { CardSvg, courts, suits, availableCards } from "../assets/cards";
import { Icon } from "./Icon";

const Card = ({ court, suit, index }) => {
  const [card, setCard] = React.useState({});

  React.useEffect(() => {
    const id = suit === "joker" ? "X" : `${[courts[court]]}${suits[suit]}`;
    if (card.id === id) {
      setCard({});
      setTimeout(() => {
        setCard({ id });
      }, 10);
    } else {
      setCard({ id });
    }
  }, [court, suit, index]);

  return availableCards.includes(card.id) ? (
    <CardSvg name={card.id} className="court-card" />
  ) : null;
};

const NavButton = ({ text, icon, onClick }) =>
  onClick ? (
    <button aria-label={text} onClick={onClick}>
      <Icon name={icon} />
    </button>
  ) : (
    <span />
  );

const CourtAssignment = ({ suit, court, format }) => {
  return (
    <div
      className="court-assignment"
      data-empty={typeof court !== "number" || null}
    >
      {/* <div className="court-play-type"> */}
      {/*   {format} on */}
      {/* </div> */}
      <div className="court-number">
        {suit === "joker" ? format : `COURT ${court}`}
      </div>
    </div>
  );
};

const CourtStatus = ({ drawn, players }) => {
  if (drawn.index < 0) return null;
  if (!drawn.cards.length) {
    return <div className="court-status">{players} Players </div>;
  }
  if (drawn.index + 2 === players) {
    return <div className="court-status">1 Card Left</div>;
  }
  return (
    <div className="court-status">
      Card {drawn.index + 1} of {players}
    </div>
  );
};

const NextRound = ({ nextRound, openConfig }) => (
  <div className="next-round-actions">
    <p>All cards were drawn</p>
    <button className="next-round" onClick={nextRound}>
      Next Round
    </button>
    <button onClick={openConfig}>Court Settings</button>
  </div>
);

const CardNav = ({ back, next, openConfig }) => {
  return (
    <div className="card-nav">
      <NavButton onClick={back} icon="backward" text="Previous Card" />
      <button onClick={openConfig}>
        <Icon name="gear" />
      </button>
      <NavButton onClick={next} icon="forward" text="Next Card" />
    </div>
  );
};

const Draw = ({ draw, drawing, inProgress }) =>
  inProgress ? (
    <button className="card-draw-button" onClick={draw} disabled={drawing}>
      Draw
    </button>
  ) : null;

export { Card, NextRound, Draw, CourtAssignment, CardNav, CourtStatus };
