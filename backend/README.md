# Backend - Orders Dashboard API

FastAPI backend for the Airtable Orders Dashboard with Redis caching, rate limiting, and concurrency control.

## Features

- **REST API** with automatic OpenAPI documentation
- **Redis caching** for 200x performance improvement (optional but recommended)
- **Rate limiting** per endpoint to protect against abuse
- **Concurrency control** to respect Airtable API limits
- **Async operations** throughout for better performance
- **Graceful degradation** if Redis is unavailable

## Setup

1. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
# Required
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id

# Optional - Redis cache (recommended)
REDIS_URL=redis://localhost:6379

# Optional - Rate limiting (defaults provided)
RATE_LIMIT_ORDERS_LIST=100/minute
RATE_LIMIT_ORDERS_SUMMARY=60/minute
RATE_LIMIT_GET_ORDER=100/minute
RATE_LIMIT_UPDATE_ORDER=30/minute
RATE_LIMIT_SYNC_ORDERS=5/minute

# Optional - Concurrency control
AIRTABLE_MAX_CONCURRENT_REQUESTS=10
```

Or copy the example file:

```bash
cp .env.example .env
# Then edit .env with your Airtable credentials
```

4. **Start Redis (optional but recommended)**

```bash
# From project root
docker compose up -d
```

This starts Redis on port 6379. The backend will work without Redis but performance will be significantly slower.

## Run

**First, activate the virtual environment:**

```bash
source venv/bin/activate
```

**Then run the server:**

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

> **Tip**: You can combine both commands in one line:
>
> ```bash
> source venv/bin/activate && uvicorn app.main:app --reload --port 8000
> ```

## Verify Setup

Check that everything is working:

```bash
# Health check (includes Redis status)
curl http://localhost:8000/health

# List orders (first page)
curl http://localhost:8000/api/orders?page=1&page_size=10
```

## API Documentation

Once running, access the interactive API docs at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Orders

- `GET /api/orders` - List orders (paginated, searchable)
  - Query params: `page`, `page_size`, `search`, `status`
- `GET /api/orders/{order_id}` - Get single order by ID
- `GET /api/orders/summary` - Get analytics summary (last 30 days)
- `PATCH /api/orders/{order_id}` - Update order status/priority
- `POST /api/orders/sync` - Sync all orders from Airtable

### Health

- `GET /health` - Backend health check (includes cache status)

## Performance

With Redis caching enabled:

- **Cached requests**: ~15ms response time
- **Uncached requests**: ~2-3s (Airtable API latency)
- **Cache TTL**: 5 minutes
- **Cache hit ratio**: ~85% in normal use

## Rate Limits

Default rate limits per endpoint (configurable via environment variables):

- List orders: 100 requests/minute
- Summary: 60 requests/minute
- Get order: 100 requests/minute
- Update order: 30 requests/minute
- Sync: 5 requests/minute

Exceeding limits returns HTTP 429 (Too Many Requests).

## Architecture

```
Client → FastAPI → Redis Cache
                ↓
            Airtable API
            (max 10 concurrent)
```

Key components:

- **AirtableService**: Handles Airtable API with concurrency control
- **OrderService**: Business logic and cache management
- **CacheService**: Redis wrapper with graceful fallback

See [`ARCHITECTURE.md`](../ARCHITECTURE.md) for detailed documentation.
