from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
import asyncio
import json
import os

app = FastAPI(title="TraffiQ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming client messages if necessary
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(demo_simulation())

async def demo_simulation():
    demo_path = os.path.join(os.path.dirname(__file__), "..", "data", "demo", "demo-scenario.json")
    try:
        with open(demo_path, "r") as f:
            scenario = json.load(f)
        
        while True:
            for event in scenario.get("events", []):
                await asyncio.sleep(event["delay_seconds"])
                await manager.broadcast(json.dumps(event))
            await asyncio.sleep(5) # loop delay
    except FileNotFoundError:
        print(f"Demo scenario not found at {demo_path}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
