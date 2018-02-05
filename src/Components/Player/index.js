import React from 'react'
import PropTypes from 'prop-types'
import Card from '../Card'
import Button from '../Button'

const Player = ({ player, currentPlayer, index, hitClick, stickClick }) => (
  <div className='Player'>
    { player.currentCards && player.currentCards.map((card, index) => (<Card key={ index } { ...card } />))}
    <div className='scoreBoard'>
      <p> Name: { player.name } </p>
      <p> Current Score: { player.score } </p>
      <p> Status: { player.status } </p>
    </div>
    {
      currentPlayer &&
      player.type !== 'dealer' &&
      player.status !== 'stuck' &&
      player.score <= 21 &&
        <React.Fragment>
          <Button content='Hit' className='button' onClick={ () => hitClick(index) } />
          <Button content='Stick' className='button' onClick={ () => stickClick(index) } />
        </React.Fragment>
    }
  </div>
)

Player.propTypes = {
  player: PropTypes.object.isRequired,
  currentPlayer: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  hitClick: PropTypes.func.isRequired,
  stickClick: PropTypes.func.isRequired,
}

export default Player
