import json
import pytest
from chat.factory import MessageFactory
from channels.test import HttpClient


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
