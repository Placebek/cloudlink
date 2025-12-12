from fastapi import APIRouter, File, UploadFile, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from core.config import UPLOAD_DIR
from util.file_utils import save_upload_file
from app.api.deploy.commands.deploy_command import deploy_file_background
from app.api.deploy.schemas.response import PingResponse
from datetime import datetime
from typing import Dict, Any
from app.api.deploy.commands.ws_command import manager
import asyncio
import aiohttp


router = APIRouter()

@router.post("/upload-and-deploy", summary="Просто отправить файл")
async def upload_and_deploy(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Только скопировать файл")
):
    file_path = await save_upload_file(file, UPLOAD_DIR)
    background_tasks.add_task(deploy_file_background, file_path, run_after_deploy=False)
    return JSONResponse({"message": "Файл отправлен на малинки", "filename": file.filename})


@router.post("/upload-and-run", summary="Отправить файл и его запустить")
async def upload_and_run(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Скопировать + сразу запустить")
):
    file_path = await save_upload_file(file, UPLOAD_DIR)
    background_tasks.add_task(deploy_file_background, file_path, run_after_deploy=True)
    return JSONResponse({
        "message": "Файл отправлен и запущен на всех малинках!",
        "filename": file.filename
    })


RASPBERRY_PIS = {
    "pi1": "192.168.137.100",
}

device_status = {}

clients = set()

connected_clients: set[WebSocket] = set()

async def broadcast():
    if not connected_clients:
        return
    message = {
        "type": "update",
        "devices": device_status.copy()
    }
    dead_clients = []
    for client in connected_clients:
        try:
            await client.send_json(message)
        except WebSocketDisconnect:
            dead_clients.append(client)
    for client in dead_clients:
        connected_clients.discard(client)


async def ping_one(name: str, ip: str):
    try:
        proc = await asyncio.create_subprocess_exec(
            "ping", "-c", "1", "-W", "2", ip,
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL
        )
        await proc.wait()
        if proc.returncode == 0:
            device_status[name] = {
                "status": "online",
                "ip": ip,
                "last_seen": datetime.now().strftime("%H:%M:%S")
            }
        else:
            device_status[name]["status"] = "offline"
            device_status[name]["last_seen"] = datetime.now().strftime("%H:%M:%S")
    except:
        device_status[name]["status"] = "offline"
        device_status[name]["last_seen"] = datetime.now().strftime("%H:%M:%S")


async def ping_loop():
    while True:
        await asyncio.gather(*[ping_one(name, ip) for name, ip in RASPBERRY_PIS.items()])
        await broadcast()
        await asyncio.sleep(5)


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    await websocket.send_json({"type": "update", "devices": device_status.copy()})
    try:
        while True:
            await websocket.receive_text()  
    except WebSocketDisconnect:
        connected_clients.discard(websocket)