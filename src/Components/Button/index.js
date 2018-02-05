import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Button = ({ content, className, onClick }) => (
  <div className={ className } onClick={ onClick }>
    <p> { content } </p>
  </div>
)

Button.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default Button
