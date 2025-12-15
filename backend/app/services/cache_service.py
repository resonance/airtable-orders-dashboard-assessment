import redis
from typing import Optional, Any
from app.config import settings
import json

class CacheKeys:
    """Cache key constants."""

    @staticmethod
    def orders_list(page: int, page_size: int) -> str:
        return f"orders:list:page={page}:size={page_size}"

    @staticmethod
    def orders_all() -> str:
        return "orders:all"

    @staticmethod
    def order_detail(order_id: str) -> str:
        return f"orders:detail:{order_id}"

    @staticmethod
    def orders_summary() -> str:
        return "orders:summary"

class CacheService:
    """Service for redis caching."""

    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self.ttl = settings.cache_ttl

    async def connect(self):
        """Connect to the Redis server."""
        try:
            if not self.client:
                self.client = redis.from_url(settings.redis_url)
        except Exception as e:
            print(f"Failed to initialize Redis client: {e}")
            self.client = None

    async def disconnect(self):
        """Disconnect from the Redis server."""
        if self.client:
            await self.client.close()
            self.client = None

    async def get(self, key: str) -> Any | None:
        """Get a value from the cache."""
        if not self.client:
            return None
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
        except Exception:
            return None
        return None

    async def set(self, key: str, value: Any) -> None:
        """Set a value in the cache."""
        if not self.client:
            return
        try:
            await self.client.set(
                key,
                json.dumps(value),
                ex=self.ttl
            )
        except Exception:
            pass

    async def delete(self, key: str) -> None:
        """Delete a value from the cache."""
        if not self.client:
            return
        try:
            await self.client.delete(key)
        except Exception:
            pass

    async def delete_pattern(self, pattern: str) -> None:
        """Delete multiple keys matching a pattern."""
        if not self.client:
            return

        try:
            keys = await self.client.keys(pattern)
            if keys:
                await self.client.delete(*keys)
        except Exception:
            pass

    async def get_cached_data(self, key: str) -> Any | None:
        """Get cached data (alias for get method)."""
        return await self.get(key)

    async def set_cached_data(self, key: str, value: Any) -> None:
        """Set cached data (alias for set method)."""
        await self.set(key, value)

cache_service = CacheService()
