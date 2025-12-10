from fastapi import APIRouter, File, UploadFile, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from core.config import UPLOAD_DIR
from util.file_utils import save_upload_file
from app.api.deploy.commands.deploy_command import deploy_file_background
from app.api.deploy.schemas.response import PingResponse
from datetime import datetime
from typing import Dict, Any
from app.api.deploy.commands.ws_command import manager


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


online_devices: Dict[str, Any] = {}

@router.post("/ping")
async def device_ping(request: dict):
    device = request.get("device", "unknown")
    ip = request.get("ip", "?.?.?.?")
    status = request.get("status", "online")

    online_devices[device] = {
        "status": status,
        "ip": ip,
        "last_seen": datetime.now().strftime("%H:%M:%S")
    }

    print(f"ONLINE → {device} ({ip})")

    await manager.broadcast({
        "type": "update",
        "devices": online_devices
    })

    return {"status": "ok"}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    await manager.broadcast({"type": "update", "devices": online_devices})
    try:
        while True:
            await websocket.receive_text()  
    except WebSocketDisconnect:
        manager.disconnect(websocket)