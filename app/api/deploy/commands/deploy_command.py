import subprocess
from pathlib import Path
from core.config import ANSIBLE_DIR
import asyncio


async def run_ansible_playbook(file_path: Path):
    playbook = ANSIBLE_DIR / "playbook_deploy_file.yml"

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


async def deploy_file_background(file_path: Path):
    returncode, stdout, stderr = await run_ansible_playbook(file_path)

    if returncode == 0:
        print(f"Успешно развёрнуто: {file_path.name}")
        print(stdout)
    else:
        print(f"ОШИБКА Ansible (код {returncode}): {file_path.name}")
        print(stderr)

    from util.file_utils import cleanup_file
    cleanup_file(file_path)