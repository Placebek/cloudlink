from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.auth.schemas.create import LoginRequest, RegisterRequest
from app.api.auth.schemas.response import TokenResponse, RegisterResponse
from app.api.auth.commands.auth_command import login_service, register_service


router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterResponse)
async def register(user_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    data = await register_service(user_data, db)
    return RegisterResponse(**data)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await login_service(credentials.username, credentials.password, db)