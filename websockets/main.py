import json
from dataclasses import dataclass, field
from fastapi import FastAPI, WebSocket
# from fastapi import FastAPI, HTTPException, Response

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

