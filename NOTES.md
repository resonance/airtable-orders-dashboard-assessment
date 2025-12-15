# Solution Notes

## Overview

Built a full-stack dashboard to manage 2000+ orders from Airtable with real-time analytics and inline editing capabilities.

**Architecture:**

- **Backend (FastAPI)**: REST API with Redis caching, rate limiting, and concurrency control
- **Frontend (React + TypeScript)**: Dashboard with TanStack Query for state management, Recharts for visualizations
- **Caching Layer (Redis)**: 5-minute TTL cache achieving 200x performance improvement (2.8s → 15ms)

**Key Features:**

- Paginated orders table with search, sort, and filter
- Real-time metrics: total orders, revenue, status distribution
- 30-day trend charts and status breakdown
- Inline order updates with optimistic UI
- Manual sync from Airtable
- Health monitoring with cache status indicator

## Tradeoffs & Assumptions

### 1. Caching Strategy

**Decision:** Simple TTL-based cache (5 minutes) with manual invalidation on updates

**Why:** Balances freshness with performance. More complex strategies (event-based, webhooks) would be overkill for an internal dashboard.

**Tradeoff:** Potential stale data if someone updates directly in Airtable, but TTL limits this to 5 minutes max.

### 2. Pagination: Offset-Based

**Decision:** Standard page/page_size parameters

**Why:** Simple, intuitive, works with Airtable's pagination model.

**Tradeoff:** Not ideal for very deep pagination (page 100+), but realistic users will search/filter instead. Cursor-based pagination would be better at scale but Airtable doesn't support stable cursors.

### 3. Rate Limiting

**Decision:** Per-endpoint limits + semaphore for Airtable requests (max 10 concurrent)

**Why:** Airtable has 5 req/sec limit. Semaphore prevents overwhelgit ming their API.

**Tradeoff:** Single-instance rate limiting (in-memory). Won't work across multiple backend instances, but acceptable for internal tool with small user base.

### 6. Optimistic Updates

**Decision:** Update UI immediately before API confirms

**Why:** Makes the app feel instant. React Query handles automatic rollback on failure.

**Tradeoff:** If backend is down, users see changes that don't persist. We show error toasts to make this clear.

### 7. Error Handling: Graceful Degradation

**Decision:** Continue without Redis if it's unavailable

**Why:** Better slow than broken. Cache is an optimization, not a requirement.

**Tradeoff:** Performance degrades significantly without cache (200x slower), but system remains functional.

## What I'd Improve With More Time

### High Priority

**1. Tests** _(Not implemented due to time constraints)_

- Backend: pytest with mocked Airtable/Redis
- Frontend: Vitest + React Testing Library
- E2E: Playwright for critical flows
- Set up test fixtures and basic structure but didn't complete implementation
- Would prioritize testing the service layer and critical user flows first

**2. Better Error Handling**

- Structured error codes
- Retry logic with exponential backoff
- Error boundaries in React
- More specific error messages

**3. Real-time Updates**

- WebSockets for live data when another user makes changes
- Currently requires manual refresh or relies on React Query's background refetch

### Medium Priority

**4. Batch Operations**

- Update multiple orders at once
- Currently one at a time

**5. More Analytics**

- Revenue trends over time
- Customer breakdown
- Order value distribution
- Export to CSV/Excel

**6. Advanced Filtering**

- Date range picker
- Revenue range
- Multiple status selection
- Saved filter presets

**7. Authentication & Authorization**

- OAuth integration
- Role-based access (viewer vs. editor)
- Audit log for who changed what

### Nice to Have

**8. Performance Optimizations**

- Query prefetching on hover
- Virtual scrolling for large tables
- Service worker for offline support

**9. UX Enhancements**

- Dark mode
- Customizable columns
- Drag-and-drop sorting
- Keyboard shortcuts

**10. Monitoring & Observability**

- Structured logging (JSON)
- Application metrics (Prometheus)
- Error tracking (Sentry)
- Performance monitoring

## Technical Highlights

### Performance

- **Cache hit ratio:** ~85% in normal use
- **Response times:**
  - Cached: ~15ms
  - Uncached: ~2.8s
  - Improvement: 200x faster
- **Concurrency control:** Semaphore limits Airtable requests to prevent rate limit errors

### Type Safety

- TypeScript throughout frontend
- Pydantic models in backend
- Shared type definitions ensure consistency

### Developer Experience

- Hot reload in both frontend and backend
- Auto-generated API docs (FastAPI)
- Type checking catches bugs before runtime
- Clear separation of concerns

## Architecture Trade-offs

**Good for:**

- Small to medium teams (10-20 concurrent users)
- A few thousand orders
- Internal tooling with moderate scale

**Limitations:**

- Single backend instance (rate limiting not distributed)
- Redis single node (no HA)
- Airtable API is the bottleneck (5 req/sec)

**If scaling needed:**

- Move from Airtable to PostgreSQL for local analytics
- Implement distributed caching (Redis Cluster)
- Add load balancer for horizontal backend scaling
- Consider GraphQL for more flexible queries

## Time Spent

- Backend API & services: ~4 hours
- Frontend components & state: ~4 hours
- Redis caching implementation: ~1.5 hours
- Rate limiting & concurrency control: ~1 hour
- Bug fixes (cache serialization, async Redis): ~1 hour
- Documentation (README, ARCHITECTURE, this file): ~1.5 hours

**Total: ~13 hours**

Most time went to getting caching right (datetime serialization issues) and the frontend table with all its features (search, sort, filter, inline editing).
