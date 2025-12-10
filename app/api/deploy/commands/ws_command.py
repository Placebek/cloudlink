from fastapi import WebSocket, WebSocketDisconnect


connected_clients = set()

class ConnectionManager:
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        connected_clients.add(websocket)

    def disconnect(self, websocket: WebSocket):
        connected_clients.discard(websocket)

    async def broadcast(self, data: dict):
        dead = set()
        for client in connected_clients:
            try:
                await client.send_json(data)
            except WebSocketDisconnect:
                dead.add(client)
        for client in dead:
            connected_clients.discard(client)

manager = ConnectionManager()