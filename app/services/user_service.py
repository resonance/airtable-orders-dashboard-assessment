class UserService:
    def __init__(self):
        self.users = []

    def get_all_users(self):
        return self.users

    def add_user(self, user):
        new_user = {
            "id": len(self.users) + 1,
            "name": user.get("name"),
            "email": user.get("email")
        }
        self.users.append(new_user)
        return new_user