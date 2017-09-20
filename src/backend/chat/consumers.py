import logging
from django.http import HttpResponse, JsonResponse
from channels import Group
from channels.handler import AsgiHandler
from urllib.parse import parse_qs
from chat.models import Message
from chat.contants import MAX_MESSAGES_LIMIT
from chat.middleware import _add_cors_to_response

logger = logging.getLogger(__name__)


def http_messages(channel_message):
    # parse params
    params = parse_qs(channel_message.content["query_string"])
    logger.debug("params: {}".format(params))

    # fetch messages
    limit = _parse_limit(params)
    messages = reversed(Message.objects.order_by("-timestamp")[:limit])

    # generate data in json format
    data = {"messages": list(map(Message.as_dict, messages))}
    response = JsonResponse(data)

    # HACK: add cors headers
    response = _add_cors_to_response(response)

    for chunk in AsgiHandler.encode_response(response):
        channel_message.reply_channel.send(chunk)


def ws_connect(channel_message):
    logger.debug("WS connect: {}".format(channel_message.__dict__))
    channel_message.reply_channel.send({"accept": True})
    Group("chat").add(channel_message.reply_channel)


def ws_receive(channel_message):
    logger.debug("WS receive: {}".format(channel_message.__dict__))
    text = channel_message.content["text"]
    message = Message.objects.create(text=text)

    logger.debug("WS broadcast chat message: {}".format(message))
    Group("chat").send({
        "text": message.to_json()
    })


def ws_disconnect(channel_message):
    logger.debug("WS disconnect: {}".format(channel_message.__dict__))
    Group("chat").discard(channel_message.reply_channel)


def _parse_limit(params):
    try:
        return int(params.get("limit")[0])
    except:
        return MAX_MESSAGES_LIMIT
