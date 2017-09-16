import json

from django.http import HttpResponse
from channels import Group
from channels.handler import AsgiHandler


def http_index(message):
    response = HttpResponse('HTTP index endpoint')

    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def http_messages(message):
    response = HttpResponse('HTTP messages endpoint')

    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def ws_connect(message):
    pass

def ws_receive(message):
    pass

def ws_disconnect(message):
    pass
