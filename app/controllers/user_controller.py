from app.services.user_service import UserService
from app.schemas.user_schema import User

service = UserService()

def list_users():
    users = service.get_all_users()
    return users

def create_user(user_data: User):
    new_user = service.add_user(user_data.dict())
    return new_user