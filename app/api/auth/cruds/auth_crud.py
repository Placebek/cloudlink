from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import User


async def get_user_by_username(username: str, db: AsyncSession) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def create_user(user: User, db: AsyncSession) -> User:
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user