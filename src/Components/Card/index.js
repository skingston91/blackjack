import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Card = ({ image, name, code, show }) => {
  if (!show) return null;
  return (
    <div className='card'>
      <p> { name + code } </p>
    </div>
  )
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

export default Card
