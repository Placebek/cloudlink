from pydantic import BaseModel


class PingResponse(BaseModel):
    device: str
    status: str
    ip: str | None = None