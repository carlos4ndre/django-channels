import React from "react"

const Message = props => {
  return <p>[{props.timestamp}] {props.text}</p>
}

export default Message;
