import React, { Component } from 'react';
import { Input, List } from 'semantic-ui-react'

export default class App extends Component {

  render() {
    return (
      <div className="message-box">
        <div className="message-board">
          <List>
            <List.Item>[15/09/2018 20:00] A + B = C</List.Item>
            <List.Item>[15/09/2018 20:40] Hello!</List.Item>
            <List.Item>[15/09/2018 22:10] 123456789</List.Item>
            <List.Item>[15/09/2018 23:30] Random()</List.Item>
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
