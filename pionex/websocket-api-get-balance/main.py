import websocket
import json

api_key = 'YOUR_API_KEY'
api_secret = 'YOUR_API_SECRET'

websocket_url = 'wss://api.pionex.com/pn?api_key=' + api_key

subscribe_payload = {
    "id": "1",
    "action": "subscribe",
    "channel": "balance"
}

def on_message(ws, message):
    response = json.loads(message)
    if response['id'] == '1':
        if response['code'] == 0:
            print("Successfully subscribed to balance stream")
        else:
            print("Failed to subscribe to balance stream")
    else:
        print("Balance update received:", response)

def on_error(ws, error):
    print("WebSocket error:", error)

def on_close(ws):
    print("WebSocket connection closed")

def on_open(ws):
    print("WebSocket connection opened")
    ws.send(json.dumps(subscribe_payload))

ws = websocket.WebSocketApp(websocket_url,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
ws.on_open = on_open

ws.run_forever()
