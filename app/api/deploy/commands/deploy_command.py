import subprocess
from pathlib import Path
from core.config import ANSIBLE_DIR
import asyncio


async def run_ansible_playbook(file_path: Path, playbook_name: str):
    playbook = ANSIBLE_DIR / playbook_name

    cmd = [
        "ansible-playbook",
        str(playbook),
        "-e", f"uploaded_file_path={file_path}",
        "-e", f"uploaded_file_name={file_path.name}",
    ]

    loop = asyncio.get_running_loop()
    process = await loop.run_in_executor(
        None,
        lambda: subprocess.run(
            cmd,
            cwd=ANSIBLE_DIR,
            capture_output=True,
            text=True,
            check=False,
        )
    )
    return process.returncode, process.stdout, process.stderr


async def deploy_file_background(file_path: Path, run_after_deploy: bool = False):
    playbook = "playbook_deploy_and_run.yml" if run_after_deploy else "playbook_deploy_file.yml"

    returncode, stdout, stderr = await run_ansible_playbook(file_path, playbook)

    action = "скопирован и запущен" if run_after_deploy else "скопирован"
    status = "Успешно" if returncode == 0 else "ОШИБКА"

    print(f"{status}: {file_path.name} — {action}")
    print(stdout)
    if stderr.strip():
        print("STDERR:", stderr)

    # Удаляем временный файл
    from util.file_utils import cleanup_file
    cleanup_file(file_path)