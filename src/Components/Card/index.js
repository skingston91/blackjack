import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Card = ({ image, name, show }) => (
  <div className='card'>
    { show && <p> { name } </p> }
  </div>
)

Card.propTypes = {
  name: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

export default Card
