from fastapi import APIRouter
from app.controllers.user_controller import list_users, create_user
from app.schemas.user_schema import User, UserResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users():
    return list_users()

@router.post("/", response_model=UserResponse)
def add_user(user: User):
    return create_user(user)