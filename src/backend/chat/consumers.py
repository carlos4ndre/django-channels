from django.http import HttpResponse, JsonResponse
from channels import Group
from channels.handler import AsgiHandler


DUMMY_MESSAGES = [
    {"text": "message #1"},
    {"text": "message #2"},
    {"text": "message #3"},
]

def http_index(message):
    response = HttpResponse("HTTP index endpoint")

    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def http_messages(message):
    response = JsonResponse({"messages": DUMMY_MESSAGES})

    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def ws_connect(message):
    pass

def ws_receive(message):
    pass

def ws_disconnect(message):
    pass
