import React, { Component } from 'react';
import { Input, List } from 'semantic-ui-react'
import emoji from 'react-easy-emoji'
import axios from 'axios';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
      axios.get("http://localhost:8000/messages")
      .then(response => {
        console.debug(response)
        this.setState({
          messages: response.data.messages,
        })
      })
      .catch((error) => {
        console.info("error",error)
      })
  }

  render() {
    let messages;
    if (this.state.messages.length < 0) {
      messages = this.state.messages.map((message, i) =>
              <List.Item key={i}>[{message.timestamp}] {message.text}</List.Item>)
    }
    else {
      messages = <List.Item><h3>{emoji('No messages yet... 😀')}</h3></List.Item>
    }

    return (
      <div className="message-box">
        <div className="message-board">
          <List>
            { messages }
          </List>
        </div>
        <div className="message-sender">
          <Input action='Send Message'
            fluid
            size='large'
            placeholder='Type some stuff...'
          />
        </div>
      </div>
    );
  }
};
