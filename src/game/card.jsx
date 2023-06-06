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

const CardSvg = ({ court, suit }) => {
  const card = suit === 'joker' ? 'cardX' : `card${[courts[court]]}${suits[suit]}`
  const Svg = cards[card]

  return <Svg className="court-card" />
}

const Next = ({ next }) => (
  next 
    ? (
      <button
        aria-label="next card"
        onClick={next}
      >
        <Icon name="forward" />
      </button>
    ) : <span /> 
)
const Back = ({ back }) => (
  back 
    ? (
      <button
        className="prev-card"
        aria-label="previous card"
        onClick={back}
      >
        <Icon name="backward" />
      </button>
    ) : <span /> 
)

const Card = ({ inProgress, card, draw, next, back, drawing, openConfig, nextRound }) => {
  const { court, suit } = card || {}
  return (
    <div className="court-assignment">
      { nextRound ? (
        <div className="next-round-actions">
          <p>All Cards were drawn</p>
          <button className="next-round" onClick={nextRound}>Next Round</button>
          <button onClick={openConfig}>Change Settings</button>
        </div>
      ) : null }
      <CardSvg court={court} suit={suit} />
      <div className="court-assignment-wrapper">
        { inProgress ? <button className="card-draw-button" onClick={draw} disabled={drawing}>Draw</button> : null }
        <div className="court-assignment-strip">
          <div className="court-play-type">
            You're {suit === 'joker' ? 'rotating' : 'playing'} on
          </div>
          <div className="court-number">
            COURT {court + 1}
          </div>
        </div>
        <div className="draw-nav">
          <Back back={back} />
          <button onClick={openConfig}><Icon name="gear" /></button>
          <Next next={next} />
        </div>
      </div>
    </div>
  )
}

export { Card }
