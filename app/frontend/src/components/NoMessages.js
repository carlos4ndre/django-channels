import React from "react"
import { List } from "semantic-ui-react"
import emoji from "react-easy-emoji"

const NoMessages = () => (
  <List.Item>
    <h3>{emoji("No messages yet... 😀")}</h3>
  </List.Item>
);

export default NoMessages;
