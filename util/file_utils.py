import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException


async def save_upload_file(upload_file: UploadFile, destination: Path) -> Path:
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="Имя файла пустое")

    file_path = destination / upload_file.filename
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()
    
    return file_path


def cleanup_file(file_path: Path):
    try:
        if file_path.exists():
            file_path.unlink()
            print(f"Временный файл удалён: {file_path}")
    except Exception as e:
        print(f"Ошибка при удалении файла {file_path}: {e}")