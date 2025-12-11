"""Application configuration settings."""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Aplication seetings loaded from environment variables."""

    airtable_api_key: str
    airtable_base_id: str
    airtable_table_id: str

    class Config:
        env_file = ".env"


settings = Settings()
