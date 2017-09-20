import React from "react"
import PropTypes from 'prop-types';

const Message = (props) => {
  return <p>[{props.timestamp}] {props.text}</p>
}

Message.propTypes = {
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired
}

export default Message;
