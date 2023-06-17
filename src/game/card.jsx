import "./card.css"
import * as cards from '../assets/cards'
import { Icon } from './Icon'

const courts = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'X']
const suits = {
  spades: 'S',
  clubs: 'C',
  hearts: 'H',
  diamonds: 'D',
}

const Card = ({ court, suit }) => {
  const card = suit === 'joker' ? 'cardX' : `card${[courts[court]]}${suits[suit]}`
  const Svg = cards[card]

  return <Svg className="court-card" />
}

const NavButton = ({ text, icon, onClick }) => (
  onClick ? (
    <button aria-label={text} onClick={onClick} >
      <Icon name={icon} />
    </button>
  ) : <span /> 
)

const CourtAssignment = ({ suit, court, oddFormat }) => (
  <div className="court-assignment">
    { oddFormat ? (
      <div className="court-play-type">
        {oddFormat} on
      </div>
    ) : null}
    { suit === 'joker' ? (
      <div className="court-play-type">
        You're {suit === 'joker' ? 'rotating' : 'playing'} on
      </div>
    ) : null }
    <div className="court-number">
      COURT {court + 1}
    </div>
  </div>
)

const CourtStatus = ({ cardsRemaining, players, drawn }) => {
  return (
    <div className="court-status">
      { players } Players, { cardsRemaining } Card{ cardsRemaining === 1 ? '' : 's'} { cardsRemaining !== players ? 'left' : ''}
    </div>
  )
}

const NextRound = ({ nextRound, openConfig }) => (
  <div className="next-round-actions">
    <p>All cards were drawn</p>
    <button className="next-round" onClick={nextRound}>Next Round</button>
    <button onClick={openConfig}>Court Settings</button>
  </div>
)

const CardNav = ({ back, next, openConfig }) => {
  return (
    <div className="card-nav">
      <NavButton onClick={back} icon="backward" text="Previous Card" />
      <button onClick={openConfig}><Icon name="gear" /></button>
      <NavButton onClick={next} icon="forward" text="Next Card" />
    </div>
  )
}

const Draw = ({ draw, drawing, inProgress }) => (
  inProgress ? <button className="card-draw-button" onClick={draw} disabled={drawing}>Draw</button> : null
)

export {
  Card,
  NextRound,
  Draw,
  CourtAssignment,
  CardNav,
  CourtStatus,
}
