import React, { Component } from "react";
import { Input } from "semantic-ui-react"
import ReconnectingWebSocket from "reconnecting-websocket";
import MessageList from "./MessageList"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";
import axiosRetry from 'axios-retry';


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      loading: true,
    };
  }

  componentDidMount() {
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
    this.fetchLatestMessages()
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

  fetchLatestMessages() {
    axiosRetry(axios, { retries: 3 });
    axios.get("http://localhost:8000/messages")
    .then(response => {
      this.setState({
        messages: response.data.messages,
        loading: false,
      })
    })
    .catch((error) => {
      console.info("error", error)
      this.setState({
        messages: [],
        loading: false,
      })
      this.createNotification("error", "Failed to get messages!")
    })
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
  }

  render() {
    return (
      <div id="message-box">
        <div id="message-board">
          <MessageList messages={this.state.messages}
                       loading={this.state.loading}/>
        </div>
        <NotificationContainer />
        <div id="message-sender">
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
