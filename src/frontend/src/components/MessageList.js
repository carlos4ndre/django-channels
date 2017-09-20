import React, { Component } from "react";
import PropTypes from 'prop-types';
import { List } from "semantic-ui-react"
import NoMessages from "./NoMessages"
import LoadingIcon from "./LoadingIcon.js"
import Message from "./Message"

export default class MessageList extends Component {

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
  };

  render() {
    let messages;

    if (this.props.loading) {
      messages = <LoadingIcon />
    }
    else if (this.props.messages.length > 0) {
      messages = this.props.messages.map((message, i) =>
      <List.Item key={i}>
        <Message text={message.text}
                 timestamp={message.timestamp}/>
      </List.Item>)
    }
    else {
      messages = <NoMessages />
    }

    return (
      <div className={this.props.className} ref={(el) => { this.messagesContainer = el; }}>
        <List>{messages}</List>
      </div>
    )
  }
}

MessageList.propTypes = {
  className: PropTypes.string,
  messages: PropTypes.array.isRequired,
}
