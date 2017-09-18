import json
import pytest
from channels.test import WSClient, HttpClient
from chat.factory import MessageFactory


@pytest.mark.django_db
def test_http_messages():
    # populate db with messages
    MESSAGE_START_SEQUENCE = 1
    MESSAGE_BATCH_SIZE = 5
    MessageFactory.create_batch(size=MESSAGE_BATCH_SIZE)

    # fetch messages
    client = HttpClient()
    client.send_and_consume("http.request", content={
        "path": "/messages",
        "method": "GET",
        "query_string": {}
    })
    response = client.receive()
    content = json.loads(response["content"])
    messages = content["messages"]

    # check response
    assert len(messages) == MESSAGE_BATCH_SIZE

    first_message = messages[0]
    assert first_message["text"] == "Message #{}".format(MESSAGE_START_SEQUENCE)

    last_message = messages[-1]
    assert last_message["text"] == "Message #{}".format(MESSAGE_BATCH_SIZE)


@pytest.mark.django_db
def test_http_messages_with_limit():
    # populate db with messages
    HTTP_PARAMS_LIMIT = 2
    MESSAGE_BATCH_SIZE = 5
    MessageFactory.create_batch(size=MESSAGE_BATCH_SIZE)

    # fetch messages
    client = HttpClient()
    client.send_and_consume("http.request", content={
        "path": "/messages",
        "method": "GET",
        "query_string": "limit={}".format(HTTP_PARAMS_LIMIT),
    })
    response = client.receive()
    content = json.loads(response["content"])
    messages = content["messages"]

    # check response
    assert len(messages) == HTTP_PARAMS_LIMIT

@pytest.mark.django_db
def test_ws_connect():
    # connect to chat group
    client = WSClient()
    client.send_and_consume("websocket.connect", path="/chat")

    # check there is no errors
    assert client.receive(json=False) == None

@pytest.mark.django_db
def test_ws_disconnect():
    # disconnect from chat group
    client = WSClient()
    client.send_and_consume("websocket.connect", path="/chat")
    client.send_and_consume("websocket.disconnect", path="/chat")

    # check there is no errors
    assert client.receive(json=False) == None

@pytest.mark.django_db
def test_ws_receive():
    # send message
    text = "this is a text"
    client = WSClient()
    client.send_and_consume("websocket.connect", path="/chat")
    client.send_and_consume("websocket.receive", path="/chat", text=text)

    # consume message and check content
    response = client.receive(json=True)
    assert response["text"] == text
