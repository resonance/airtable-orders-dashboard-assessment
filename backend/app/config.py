from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    airtable_api_key: str
    airtable_base_id: str
    airtable_table_id: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
