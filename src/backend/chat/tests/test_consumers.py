import json
import pytest
from channels.test import WSClient, HttpClient
from chat.factory import MessageFactory


@pytest.mark.django_db
def test_http_get_messages():
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
def test_http_post_messages():
    # prepare test data
    text = "hello there!"
    ws_client = WSClient()
    http_client = HttpClient()

    # subscribe to chat channel
    ws_client.send_and_consume("websocket.connect", path="/chat")
    assert ws_client.receive(json=False) is None

    # post message
    http_client = HttpClient()
    http_client.send_and_consume("http.request", content={
        "path": "/messages",
        "method": "POST",
        "body": json.dumps({"text": text})
    })
    response = http_client.receive()
    response_code = response["status"]
    response_content = json.loads(response["content"])
    assert response_code == 200
    assert response_content == {}

    # check message is broadcast to chat channel
    response = ws_client.receive()
    response_text = response["text"]
    assert response_text == text


@pytest.mark.django_db
def test_ws_connect():
    # connect to chat group
    client = WSClient()
    client.send_and_consume("websocket.connect", path="/chat")

    # check there is no errors
    assert client.receive(json=False) is None


@pytest.mark.django_db
def test_ws_disconnect():
    # disconnect from chat group
    client = WSClient()
    client.send_and_consume("websocket.connect", path="/chat")
    client.send_and_consume("websocket.disconnect", path="/chat")

    # check there is no errors
    assert client.receive(json=False) is None
