import "./card.css"
import * as cards from '../assets/cards'

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

const Card = ({ card, draw, next, back, drawing, openConfig, reset }) => {
  const { court, suit } = card || {}
  return (
    <div className="court-assignment">
      { reset ? <button className="reset-court" onClick={reset}>Next Round</button> : null }
      <CardSvg court={court} suit={suit} />
      <div className="court-assignment-wrapper">
        { draw ? <button className="card-draw-button" onClick={draw} disabled={drawing}>Draw</button> : null }
        <div className="court-assignment-strip">
          <div className="court-play-type">
            You're {suit === 'joker' ? 'rotating' : 'playing'} on
          </div>
          <div className="court-number">
            COURT {court + 1}
          </div>
        </div>
        <div className="draw-nav">
          { back ? <button onClick={back}>Back</button> : <span /> }
          <button onClick={openConfig}>config</button>
          { next ? <button onClick={next}>Next</button> : <span /> }
        </div>
      </div>
    </div>
  )
}

export { Card }
