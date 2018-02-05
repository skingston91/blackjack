import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Card = ({ image, name, show }) => {
  if (!show) return null;
  return (
    <div className='card'>
      <p> { name } </p>
    </div>
  )
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

export default Card
