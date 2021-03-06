import React, { Component } from "react";
import { Input } from "semantic-ui-react"
import ReconnectingWebSocket from "reconnecting-websocket";
import MessageList from "./MessageList"
import {NotificationContainer, NotificationManager} from "react-notifications";
import axios from "axios";
import axiosRetry from "axios-retry";
import Settings from "../settings"


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      loading: true
    };
  }

  componentDidMount() {
    this.socket = new ReconnectingWebSocket(Settings.WS_CHAT_URL)
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
    axiosRetry(axios, { retries: Settings.HTTP_MAX_RETRIES });
    axios.get(Settings.HTTP_MESSAGES_URL)
    .then(response => {
      this.setState({
        messages: response.data.messages,
        loading: false
      })
    })
    .catch((error) => {
      console.info("error", error)
      this.setState({
        messages: [],
        loading: false
      })
      this.createNotification("error", "Failed to get messages!")
    })
  }

  sendMessage(text) {
    console.debug("Sending text:", text)
    const data = {"text": text}

    axiosRetry(axios, { retries: Settings.HTTP_MAX_RETRIES });
    axios.post(Settings.HTTP_MESSAGES_URL, data)
    .then(response => {
      console.debug("Message sent!")
    })
    .catch((error) => {
      this.createNotification("error", "Failed to send message!")
    })
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      // send message to everyone
      let text = event.target.value
      if (text && text.trim() !== "") {
        this.sendMessage(text)
      }

      /// reset input box
      event.target.value = ""
    }
  }

  createNotification = (type, message) => {
      switch (type) {
        case 'info':
          NotificationManager.info(message, 'Info', Settings.NOTIFICATIONS_DELAY);
          break;
        case 'success':
          NotificationManager.success(message, 'Success', Settings.NOTIFICATIONS_DELAY);
          break;
        case 'warning':
          NotificationManager.warning(message, 'Warning', Settings.NOTIFICATIONS_DELAY);
          break;
        case 'error':
          NotificationManager.error(message, 'Error', Settings.NOTIFICATIONS_DELAY);
          break;
        default:
          return
      }
  }

  render() {
    return (
      <div id="message-box">
        <MessageList className="message-board"
                     messages={this.state.messages}
                     loading={this.state.loading}/>
        <Input
          className="message-sender"
          fluid
          size="large"
          placeholder="Type some stuff..."
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <NotificationContainer />
      </div>
    );
  }
}
