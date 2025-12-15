"""Application configuration settings."""

from pydantic_settings import BaseSettings
from typing import Union

class Settings(BaseSettings):
    """Aplication seetings loaded from environment variables."""

    airtable_api_key: str
    airtable_base_id: str
    airtable_table_id: str
    redis_url: str = "redis://localhost:6379"
    cache_ttl: int = 300
    api_title: str = "Airtable Orders Dashboard API"
    api_version: str = "1.0.0"
    api_description: str = "API for managing and analyzing orders from Airtable."
    cors_origins: Union[str, list[str]] = "*"

    # Rate limiting settings
    rate_limit_orders_list: str = "100/minute"
    rate_limit_orders_summary: str = "60/minute"
    rate_limit_orders_get: str = "100/minute"
    rate_limit_orders_update: str = "30/minute"
    rate_limit_orders_sync: str = "5/minute"

    # Airtable concurrency control
    airtable_max_concurrent_requests: int = 10

    class Config:
        env_file = ".env"

    def get_cors_origins(self) -> list[str]:
        """Get CORS origins as a list."""
        if isinstance(self.cors_origins, str):
            if self.cors_origins == "*":
                return ["*"]
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins


settings = Settings()
