import React from "react";
import { List } from "semantic-ui-react"
import NoMessages from "./NoMessages"
import Message from "./Message"


const MessageList = props => {
  let messages;
  if (props.messages.length > 0) {
    messages = props.messages.map((message, i) =>
      <List.Item key={i}>
        <Message text={message.text}
                 timestamp={message.timestamp}/>
      </List.Item>)
    }
    else {
      messages = <NoMessages />
    }

    return <List>{messages}</List>
}

export default MessageList;
