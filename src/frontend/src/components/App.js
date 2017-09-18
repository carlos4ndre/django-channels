import React, { Component } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Input, List } from "semantic-ui-react"
import emoji from "react-easy-emoji"
import axios from "axios";


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
        this.setState({
          messages: response.data.messages,
        })
      })
      .catch((error) => {
        console.info("error", error)
      })

      this.socket = new ReconnectingWebSocket("ws://localhost:8000/chat")
      this.socket.addEventListener("open", () => this.onSocketOpen())
      this.socket.addEventListener("close", () => this.onSocketClose())
      this.socket.addEventListener("message", (event) => this.onSocketMessage(event))
      this.socket.addEventListener("error", (event) => this.onSocketError(event))
  }

  onSocketClose() {
    console.log("Connection terminated")
  }

  onSocketOpen() {
    console.log("Connection established")
  }

  onSocketMessage(message) {
    console.debug("Received message:",  message)
    let new_message = JSON.parse(message.data)
    this.setState({
      messages: [...this.state.messages, new_message]
    })
  }

  onSocketError(error) {
    console.log(error)
  }

  sendMessage(text) {
    console.debug("Sending text:", text)
    this.socket.send(text)
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      // send message to everyone
      let text = event.target.value
      this.sendMessage(text)

      /// reset input box
      event.target.value = ""
    }
  }

  render() {
    let messages;
    if (this.state.messages.length > 0) {
      messages = this.state.messages.map((message, i) =>
              <List.Item key={i}>[{message.timestamp}] {message.text}</List.Item>)
    }
    else {
      messages = <List.Item><h3>{emoji("No messages yet... 😀")}</h3></List.Item>
    }


    return (
      <div className="message-box">
        <div className="message-board">
          <List>
            { messages }
          </List>
        </div>
        <div className="message-sender">
          <Input
            fluid
            size="large"
            placeholder="Type some stuff..."
            onKeyPress={this.handleKeyPress.bind(this)}
          />
        </div>
      </div>
    );
  }
};
