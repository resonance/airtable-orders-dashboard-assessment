# Architecture Overview

## The Problem

We need a dashboard to manage orders stored in Airtable. The main challenges:

- Airtable has 2000+ orders, so we can't just load everything at once
- Their API has rate limits (5 req/sec), so we need to be careful
- Users want to see analytics and update orders without lag

## Solution Overview

Pretty straightforward three-tier setup:

```
React Frontend → FastAPI Backend → Airtable API
                      ↓
                  Redis Cache
```

The backend sits between the frontend and Airtable to handle caching, rate limiting, and business logic. Redis is optional but makes things way faster.

## Tech Choices

**Backend: FastAPI + Python**

- FastAPI because it's fast, has great async support, and auto-generates API docs
- Python 3.10+ for the assignment requirement
- Pydantic for validation (comes with FastAPI)

**Frontend: React + TypeScript + Vite**

- React because it's the requirement
- TypeScript for type safety (catches bugs early)
- Vite because it's faster than CRA
- TanStack Query for server state - this was a key choice, more on that later

**Caching: Redis**

- Could've used in-memory cache but Redis is more realistic
- Runs in Docker so it's easy to start/stop
- Falls back gracefully if Redis is down

## Backend Structure

```
app/
├── main.py           # FastAPI app setup, CORS, lifespan events
├── config.py         # Environment variables and settings
├── routers/
│   └── orders.py     # API endpoints with rate limiting
├── services/
│   ├── airtable_service.py    # Talks to Airtable
│   ├── order_service.py       # Business logic
│   └── cache_service.py       # Redis wrapper
└── schemas/
    └── order.py      # Pydantic models
```

### Service Layer Design

**AirtableService** - Wraps the Airtable API client

- Handles pagination (Airtable limits to 100 records per request)
- Converts their records to our Order models
- Has a semaphore to limit concurrent requests to 10 (prevents hitting rate limits)

**OrderService** - The main business logic

- Gets orders from Airtable, checks cache first
- Computes analytics (total revenue, orders by status, 30-day trends)
- Handles updates and cache invalidation

**CacheService** - Redis wrapper

- Async Redis client (using redis.asyncio)
- JSON serialization for everything
- If Redis is down, just logs and continues (no cache is better than breaking)

## Caching Strategy

This was probably the most important performance decision. Here's how it works:

**Cache keys:**

- `orders:list:page=1:size=10` for paginated lists
- `orders:detail:{order_id}` for single orders
- `orders:summary` for analytics

**TTL: 5 minutes** for everything. Could be longer for analytics but 5 min keeps it simple.

**Invalidation:**

- When you update an order: delete that order's detail cache + summary + all list pages
- When you sync: delete everything (`orders:*`)

This is a simple write-through cache. We could've done write-back (update cache and async write to Airtable) but that's more complex and risky for data consistency.

**Big win:** With cache, requests go from ~2-3 seconds to ~15ms. That's 200x faster. Without it, the dashboard would feel sluggish.

## Rate Limiting

Added rate limiting because:

1. The assignment mentioned Airtable has API limits
2. It's good practice anyway

Used `slowapi` (Flask-Limiter port for FastAPI):

- Different limits per endpoint based on how expensive they are
- List orders: 100/min (cheap, mostly cached)
- Summary: 60/min (more expensive to compute)
- Update: 30/min (writes should be rarer)
- Sync: 5/min (very expensive, loads everything)

All configurable via environment variables so we can tune them.

Also added a semaphore on the Airtable service to limit concurrent requests to 10. This prevents us from overwhelming their API even if multiple users hit the backend at once.

## Frontend Architecture

Pretty standard React app structure:

```
src/
├── components/
│   ├── dashboard/       # Dashboard-specific stuff
│   │   ├── MetricCard.tsx
│   │   ├── OrdersChart.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── StatusChart.tsx
│   │   └── SyncButton.tsx
│   └── ui/             # shadcn/ui components
├── hooks/
│   └── useOrders.ts    # React Query hooks
├── lib/
│   ├── api.ts          # Axios instance
│   └── utils.ts
└── types/
    └── order.ts        # TypeScript types
```

### State Management

**Server state: TanStack Query (React Query)**

This was a key decision. Instead of using Redux or Zustand, I went with React Query to handle ALL server state. Why?

1. **Built-in caching** - automatically caches API responses
2. **Background refetching** - keeps data fresh without manual work
3. **Optimistic updates** - UI updates instantly, rolls back if the API call fails
4. **Loading/error states** - handles all the boilerplate

Example of how it works:

```typescript
// List orders with auto-caching
const { data, isLoading } = useQuery({
  queryKey: ["orders", { page, pageSize, search }],
  queryFn: () => api.getOrders(page, pageSize, search),
});

// Update with optimistic UI
const mutation = useMutation({
  mutationFn: api.updateOrder,
  onMutate: (variables) => {
    // Update UI immediately
    queryClient.setQueryData(["orders"], (old) => updateLocal(old, variables));
  },
  onError: () => {
    // Rollback if it fails
    queryClient.setQueryData(["orders"], previousData);
  },
});
```

**Local state: React hooks**

For UI stuff (search input, filters, pagination) just useState. No need to complicate it.

### Data Flow

**Reading data:**

1. Component renders, React Query checks cache
2. If cached and fresh → show it
3. If stale or missing → fetch from backend
4. Backend checks Redis
5. If Redis miss → fetch from Airtable
6. Both layers cache the result

**Updating data:**

1. User clicks "update status"
2. UI updates immediately (optimistic)
3. API call to backend
4. Backend updates Airtable and invalidates cache
5. If success → keep optimistic update
6. If error → rollback UI and show error toast

This makes the app feel instant even though we're hitting an API.

## Key Design Decisions

### 1. Cache with TTL vs. Cache Invalidation

**What I did:** Cache with 5-minute TTL + manual invalidation on updates

**Why:** Simple to implement and reason about. TTL ensures we don't serve stale data forever, but we also invalidate immediately on updates so users see their changes right away.

**Alternative:** Could've used event-based invalidation or webhooks from Airtable, but that's overengineering for this use case.

### 2. Pagination: Offset-Based

**What I did:** Standard page/page_size parameters

**Why:**

- Simple for users (page 1, 2, 3...)
- Works with Airtable's pagination model
- Easy to implement

**Tradeoff:** Not efficient for very deep pagination (like jumping to page 100), but realistically users won't do that much. They'll search/filter instead.

### 3. Error Handling: Graceful Degradation

**What I did:** If Redis is down, continue without cache. If Airtable is slow, show loading states.

**Why:** Better to be slow than broken. The dashboard is internal tooling, not life-critical. Users can tolerate some slowness better than errors.

### 5. Optimistic Updates

**What I did:** Update UI before API confirms

**Why:** Makes the app feel instant. React Query handles rollback automatically if the update fails.

**Risk:** If the backend is down, users might make changes that don't stick. We show error messages to make this clear.

## Performance Numbers

From testing with the actual Airtable data:

- **Without cache:** ~2.8s for orders list, ~2s for summary
- **With cache (hit):** ~15ms for orders list, ~12ms for summary
- **Cache hit ratio:** ~85% in normal use

So Redis is doing its job. The 200x speedup makes the difference between a sluggish dashboard and a snappy one.

The semaphore on Airtable requests keeps us under their rate limit even if multiple users are active.

## What's Missing / Future Work

Things I'd add with more time:

1. **Tests** - Started but didn't finish. Would add pytest for backend, Vitest for frontend.

2. **Better error handling** - Right now errors are pretty generic. Could add error codes, better messages, retry logic.

3. **Authentication** - For a real deployment. Probably Clerk Auth.

4. **Websockets / Server Sent Events** - For real-time updates when another user changes something. Right now you have to refresh.

5. **Batch operations** - Update multiple orders at once. Currently one at a time.

6. **More analytics** - Charts for revenue over time, customer breakdown, etc.

7. **Export** - Download orders as CSV/Excel.

8. **Audit log** - Track who changed what and when.

## Deployment Considerations

Not implemented but worth noting:

- **Backend:** Would use Gunicorn with uvicorn workers, behind nginx
- **Redis:** Should be Redis Cluster or managed service (AWS ElastiCache) for HA
- **Frontend:** Deploy to Vercel/Netlify, or serve static files from backend
- **Environment:** All config via env vars, no secrets in code
- **HTTPS:** Terminate at load balancer/reverse proxy

## Conclusion

The architecture is pretty straightforward - no magic, just good fundamentals:

- Cache where it matters (Redis)
- Rate limit to protect APIs
- Optimistic UI for speed
- Graceful degradation when things fail

The main wins are:

1. **Fast** - 200x speedup with caching
2. **Reliable** - Continues working even if Redis is down
3. **Maintainable** - Clear separation of concerns, easy to understand
4. **Type-safe** - TypeScript + Pydantic catch bugs early

Could it scale? Up to a point. The current design handles:

- A few thousand orders easily
- 10-20 concurrent users
- Airtable's rate limits

If you needed more, you'd probably move away from Airtable and use a real database. But for an internal dashboard with Airtable as the source of truth, this works well.
