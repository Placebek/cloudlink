from fastapi import APIRouter, File, UploadFile, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from core.config import UPLOAD_DIR
from util.file_utils import save_upload_file
from app.api.deploy.commands.deploy_command import deploy_file_background


router = APIRouter()

@router.post("/upload-and-deploy", summary="Отправить файл и деплоит")
async def upload_and_deploy(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Файл для отправки на Raspberry Pi")
):
    file_path = await save_upload_file(file, UPLOAD_DIR)

    background_tasks.add_task(deploy_file_background, file_path)

    return JSONResponse({
        "message": "Файл принят. Развёртывание на ЧПУ запущено.",
        "filename": file.filename,
        "size_bytes": file_path.stat().st_size,
    })