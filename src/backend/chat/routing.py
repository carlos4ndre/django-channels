from channels.routing import route, include
from chat.consumers import http_messages, ws_connect, ws_disconnect, ws_receive


http_routing = [
    route("http.request", http_messages, path=r"^/messages$", method=r"^GET$"),
]

chat_routing = [
    route("websocket.connect", ws_connect),
    route("websocket.receive", ws_receive),
    route("websocket.disconnect", ws_disconnect),
]

channel_routing = [
    include(http_routing),
    include(chat_routing, path=r"^/chat"),
]
