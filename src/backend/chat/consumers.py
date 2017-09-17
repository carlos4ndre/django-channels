import logging
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from channels import Group
from channels.handler import AsgiHandler
from urllib.parse import parse_qs
from chat.models import Message
from chat.contants import MAX_MESSAGES_LIMIT

logger = logging.getLogger(__name__)


def http_index(message):
    response = HttpResponse("HTTP index endpoint")

    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def http_messages(message):
    # parse params
    params = parse_qs(message.content["query_string"])
    logger.debug("params: {}".format(params))

    # fetch messages
    limit = _parse_limit(params)
    messages = reversed(Message.objects.order_by("-timestamp")[:limit])

    # return data in json format
    data = {"messages": list(map(Message.as_dict, messages))}
    response = JsonResponse(data)
    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)

def ws_connect(message):
    pass

def ws_receive(message):
    pass

def ws_disconnect(message):
    pass

def _parse_limit(params):
    try:
        return int(params.get('limit')[0])
    except:
        return MAX_MESSAGES_LIMIT
