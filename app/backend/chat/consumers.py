import json
import logging
from django.http import JsonResponse
from channels import Group
from channels.handler import AsgiHandler
from urllib.parse import parse_qs
from chat.models import Message
from chat.constants import MAX_MESSAGES_LIMIT
from chat.middleware import _add_cors_to_response

logger = logging.getLogger(__name__)


def http_post_messages(channel_message):
    logger.debug("HTTP post messages: {}".format(channel_message.__dict__))

    # parse body
    body = json.loads(channel_message.content["body"])

    # save message before broadcasting it
    text = body["text"]
    message = Message.objects.create(text=text)

    # broadcast message
    Group("chat").send({
        "text": message.to_json()
    })

    # return http response
    _send_http_response(channel_message, data={})


def http_get_messages(channel_message):
    logger.debug("HTTP get messages: {}".format(channel_message.__dict__))

    # parse params
    params = parse_qs(channel_message.content["query_string"])

    # fetch messages
    limit = _parse_limit(params)
    messages = reversed(Message.objects.order_by("-timestamp")[:limit])

    # return http response
    data = {"messages": list(map(Message.as_dict, messages))}
    _send_http_response(channel_message, data)


def http_cors_options(channel_message):
    logger.debug("HTTP cors options: {}".format(channel_message.__dict__))
    _send_http_response(channel_message, data={})


def ws_connect(channel_message):
    logger.debug("WS connect: {}".format(channel_message.__dict__))
    channel_message.reply_channel.send({"accept": True})
    Group("chat").add(channel_message.reply_channel)


def ws_receive(channel_message):
    logger.debug("WS receive: {}".format(channel_message.__dict__))
    pass


def ws_disconnect(channel_message):
    logger.debug("WS disconnect: {}".format(channel_message.__dict__))
    Group("chat").discard(channel_message.reply_channel)


def _parse_limit(params):
    try:
        return int(params.get("limit")[0])
    except:
        return MAX_MESSAGES_LIMIT


def _send_http_response(channel_message, data):
    response = JsonResponse(data)

    # add cors headers
    response = _add_cors_to_response(response)

    for chunk in AsgiHandler.encode_response(response):
        channel_message.reply_channel.send(chunk)
