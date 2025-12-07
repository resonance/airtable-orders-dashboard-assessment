# Airtable Orders Dashboard Assignment

## Overview

You are building a small internal dashboard for a company that tracks its orders in Airtable. The goal is to:

- Read a large Airtable base with thousands of order records  
- Build a backend API that aggregates and updates that data  
- Build a frontend in React that visualizes key metrics and lets users update orders  

How you design and implement this is up to you. We are interested in your choices, tradeoffs and code quality as much as the final result.

---

## Scenario

The company currently stores all order data in Airtable. They want:

- A backend service that:
  - Fetches orders from Airtable
  - Computes useful summary statistics
  - Allows updating certain fields on orders

- A frontend dashboard that:
  - Shows key metrics and charts
  - Lists orders in a table
  - Lets internal users update order status/priority
  - Can trigger a "sync" with Airtable

Airtable has API limits, and the base contains many records. Your implementation should take this into account.

---

## Requirements

### Tech stack

- **Backend**
  - Language: **Python**
  - Framework: **FastAPI** (or another modern Python web framework if you prefer, but FastAPI is recommended)
  - REST API for the frontend to consume
  - Integration with Airtable API

- **Frontend**
  - **React** (Vite, CRA, Next.js in SPA mode, etc. are all acceptable)
  - Talks **only** to your backend, never directly to Airtable

You are free to choose libraries for HTTP requests, charting, state management and testing.

---

## Data model (Airtable)

We provide an Airtable base with a table called `Orders` containing thousands of records.

Fields:

- `Order ID` (string, unique)
- `Customer` (string)
- `Status` (single select: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`)
- `Order Total` (number)
- `Created At` (datetime)
- `Updated At` (datetime)
- `Priority` (single select: `Low`, `Medium`, `High`)

Treat Airtable as the source of truth.

You will receive:

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_ID_OR_NAME`

---

## Backend requirements

Implement a backend with at least the following functionality. You can add more endpoints if you find it useful.

### 1. Order summary

**Endpoint:** `GET /api/orders/summary`

Returns aggregated statistics such as:

- Count of orders by `Status`
- Sum of `Order Total` by `Status`
- Count of orders per day for the last 30 days

The response shape is up to you, but it should be easy for the frontend to consume.

> Note: Airtable has API limits, and the base contains many records. You should assume this dashboard will be used by hundreds of internal users, often at the same time, so your implementation needs to behave reasonably under concurrent usage and repeated requests.

---

### 2. Sync with Airtable

**Endpoint:** `POST /api/orders/sync`

Responsibilities:

- Fetch all orders from Airtable, handling pagination correctly
- Optionally take advantage of any fields that help you avoid re-reading everything if you choose to do so
- Recompute summary statistics
- Return the same summary data as `/api/orders/summary`

If something goes wrong (Airtable issues, etc.), the endpoint should return a useful error response and log enough information to debug.

---

### 3. Update an order

**Endpoint:** `PATCH /api/orders/{order_id}`

Responsibilities:

- Update the `Status` and/or `Priority` of a specific order in Airtable
- Ensure the change is reflected by subsequent calls to your summary and list endpoints

You decide how to handle consistency with any local data or summaries.

---

### 4. Order listing (for the table)

You will need an endpoint to support an orders table in the frontend. For example:

**Endpoint:** `GET /api/orders`

- Returns a list of orders with the main fields needed for the UI
- Should support basic pagination (e.g. `page`, `pageSize` query params or similar)

The exact shape of this endpoint is up to you.

---

### Airtable and performance considerations

Assume this dashboard will be used by hundreds of internal users, often at the same time.

The Airtable base is large and Airtable enforces API limits. Hitting those limits in production would be a problem, so part of this assignment is deciding how you want to handle that. Think about things like:

- How your design behaves under repeated and concurrent requests
- How to avoid unnecessary calls to Airtable
- How to deal with rate limiting or temporary errors from Airtable

You are free to choose the strategies and tools you prefer. Briefly describe your approach in `ARCHITECTURE.md`.

---

## How to submit

1. **Fork this repository** to your own GitHub account.

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/airtable-orders-dashboard-assignment.git
   cd airtable-orders-dashboard-assignment
   ```

3. **Create a branch** for your solution:

   ```bash
   git checkout -b feature/solution-your-name
   ```

4. Implement your solution in the `backend` and `frontend` folders.

5. **Commit and push** your changes to your fork:

   ```bash
   git add .
   git commit -m "Add solution for Airtable orders dashboard"
   git push origin feature/solution-your-name
   ```

6. **Open a Pull Request** from your branch (`feature/solution-your-name`) to this repository’s `main` branch.

   In your PR description, please include:
   - A short overview of your solution
   - Any tradeoffs or assumptions you made
   - What you would improve or add if you had more time
