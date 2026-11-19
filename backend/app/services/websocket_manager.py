import json
from typing import Dict, List
from fastapi import WebSocket

class WebSocketConnectionManager:
    """
    Manages active WebSocket connections for real-time notification broadcasting
    (e.g., Background Ingestion Progress, AI Generation Stream, System Alerts).
    """
    def __init__(self):
        # Maps user_id -> List of active WebSockets (allows multiple tabs per user)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to all open tabs/devices of a specific user"""
        if user_id in self.active_connections:
            data = json.dumps(message, ensure_ascii=False)
            dead_sockets = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(data)
                except Exception:
                    dead_sockets.append(connection)
            for dead in dead_sockets:
                self.disconnect(dead, user_id)

    async def broadcast(self, message: dict):
        """Broadcast message to all connected users across the organization"""
        data = json.dumps(message, ensure_ascii=False)
        for user_id, connections in list(self.active_connections.items()):
            dead_sockets = []
            for connection in connections:
                try:
                    await connection.send_text(data)
                except Exception:
                    dead_sockets.append(connection)
            for dead in dead_sockets:
                self.disconnect(dead, user_id)

# Global singleton instance
ws_manager = WebSocketConnectionManager()
