# Airtable Orders Dashboard

Dashboard to visualize and manage orders from Airtable.

## Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript + Tailwind CSS

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
```

### Frontend

```bash
cd frontend
npm install
```

## Run

**Terminal 1:**

```bash
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
```

**Terminal 2:**

```bash
cd frontend && npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/orders/summary` | Aggregated statistics    |
| POST   | `/api/orders/sync`    | Sync with Airtable       |
| GET    | `/api/orders`         | Paginated list of orders |
| PATCH  | `/api/orders/{id}`    | Update status/priority   |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md)

## What I Would Add With More Time

- Unit/integration/E2E tests
- React error boundaries
- Docker compose setup
