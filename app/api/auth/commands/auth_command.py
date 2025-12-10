from fastapi import HTTPException, status
from app.api.auth.cruds.auth_crud import (
    get_user_by_username,
    create_user,
)
from app.api.auth.schemas.create import RegisterRequest
from util.context_utils import hash_password, verify_password, create_access_token
from model.models import User
from sqlalchemy.ext.asyncio import AsyncSession


async def login_service(username: str, password: str, db: AsyncSession):
    user = await get_user_by_username(username, db)
    if not user or not verify_password(password, user.password):  
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    access_token = create_access_token({"sub": str(user.id), "username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


async def register_service(user_data: RegisterRequest, db: AsyncSession):
    if await get_user_by_username(user_data.username, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    hashed_password = hash_password(user_data.password)

    new_user = User(
        username=user_data.username,
        password=hashed_password,  
    )

    created_user = await create_user(new_user, db)
    return {"username": created_user.username}