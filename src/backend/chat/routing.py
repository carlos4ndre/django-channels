from channels.routing import route, include
from chat import consumers


http_routing = [
    route("http.request", consumers.http_get_messages, path=r"^/messages$", method=r"^GET$"),
    route("http.request", consumers.http_post_messages, path=r"^/messages$", method=r"^POST$"),
    route("http.request", consumers.http_cors_options, path=r"^/messages$", method=r"^OPTIONS$"),
]

chat_routing = [
    route("websocket.connect", consumers.ws_connect),
    route("websocket.receive", consumers.ws_receive),
    route("websocket.disconnect", consumers.ws_disconnect),
]

channel_routing = [
    include(http_routing),
    include(chat_routing, path=r"^/chat"),
]
