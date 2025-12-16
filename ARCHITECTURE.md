# Architecture

## System Design

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │◄───►│   Backend   │◄───►│   Airtable  │
│   (React)   │     │  (FastAPI)  │     │     API     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  In-Memory │
                    │   Cache    │
                    └───────────┘
```

## Key Decisions

### In-Memory Caching

- All orders cached locally after sync
- Reads served from cache (fast, no rate limits)
- Writes go to Airtable, then update cache
- Thread-safe with `asyncio.Lock`

**Trade-offs:**

- ✅ Fast reads, no API calls
- ✅ Handles concurrent users
- ⚠️ Data stale between syncs

### Sync Operation

1. Fetch all records with pagination (100/request)
2. Handle rate limits with retry
3. Atomically update cache
4. Recompute statistics

### Write-Through Updates

1. Validate order in cache
2. PATCH to Airtable
3. Update local cache
4. Recompute summary

## File Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI entry
│   ├── config.py        # Environment config
│   ├── models/order.py  # Pydantic models
│   ├── routes/orders.py # API endpoints
│   └── services/
│       ├── airtable.py  # Airtable client
│       └── cache.py     # In-memory cache

frontend/
├── src/
│   ├── api/             # API client & queries
│   ├── components/      # UI components
│   ├── hooks/useOrders  # Orders context
│   ├── types/           # TypeScript types
│   └── views/           # Dashboard view
```

## Production Improvements

- Redis for distributed caching
- Background sync jobs
- Airtable webhooks for real-time updates
