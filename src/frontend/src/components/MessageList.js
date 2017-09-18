import React, { Component } from "react";
import { List } from "semantic-ui-react"
import NoMessages from "./NoMessages"
import Message from "./Message"


export default class MessageList extends Component {

  componentDidUpdate() {
    // TODO: fix auto scroll to bottom
  }

  render() {
    let messages;
    if (this.props.messages.length > 0) {
      messages = this.props.messages.map((message, i) =>
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
}
