from fastapi import APIRouter
from app.api.auth.auth_api import router as auth_router
from app.api.deploy.deploy_api import router as deploy_router


route = APIRouter()

route.include_router(auth_router, prefix="/auth", tags=["AUTHENTICATION"])
route.include_router(deploy_router, prefix="/deploy", tags=["DEPLOY"])