import React, { Component } from "react";
import { Input } from "semantic-ui-react"
import axios from "axios";
import ReconnectingWebSocket from "reconnecting-websocket";
import MessageList from "./MessageList"
import {NotificationContainer, NotificationManager} from 'react-notifications';


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
    this.createNotification("warning", "Connection closed")
  }

  onSocketOpen() {
    console.log("Connection established")
    this.createNotification("success", "Connection Established")
  }

  onSocketMessage(message) {
    console.debug("Received message:",  message)
    this.createNotification("success", "Received message")

    let new_message = JSON.parse(message.data)
    this.setState({
      messages: [...this.state.messages, new_message]
    })
  }

  onSocketError(error) {
    console.log(error)
    this.createNotification("error", "Something is broken!")
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

  createNotification = (type, message) => {
      switch (type) {
        case 'info':
          NotificationManager.info(message, 'Info');
          break;
        case 'success':
          NotificationManager.success(message, 'Success');
          break;
        case 'warning':
          NotificationManager.warning(message, 'Warning', 3000);
          break;
        case 'error':
          NotificationManager.error(message, 'Error', 5000, () => {
            alert('callback');
          });
          break;
        default:
          return
      }
  };

  render() {
    return (
      <div className="message-box">
        <div className="message-board">
          <MessageList messages={this.state.messages}/>
        </div>
        <NotificationContainer />
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
