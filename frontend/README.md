# Frontend - Orders Dashboard

React + TypeScript frontend for the Airtable Orders Dashboard.

## Tech Stack

- **React 18** - JS Framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling (modern @import syntax)
- **shadcn/ui** - UI component library
- **TanStack Query (React Query)** - Server state management
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Setup

1. **Install dependencies**

```bash
bun install
# or: npm install
```

2. **Configure environment variables**

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

You can copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Run

**Development server:**

```bash
bun dev
# or: npm run dev
```

The application will be available at `http://localhost:5173`

**Build for production:**

```bash
bun run build
# or: npm run build
```

**Preview production build:**

```bash
bun run preview
# or: npm run preview
```

## Features

### Dashboard Overview

- **Real-time metrics**: Total orders, revenue, and status breakdown
- **Interactive charts**:
  - 30-day order trends (line chart)
  - Status distribution (pie chart)
- **Health monitoring**: Visual indicator of backend cache status

### Orders Management

- **Paginated table**: Efficient handling of large datasets
- **Search**: Filter orders by order ID or customer name
- **Sorting**: Click column headers to sort
- **Status filtering**: Quick filter by order status
- **Inline editing**: Update order status and priority directly from the table
- **Optimistic updates**: Instant UI feedback with automatic rollback on errors

### Performance Optimizations

- **React Query caching**: Automatic background refetching and cache management
- **Optimistic mutations**: Instant UI updates before server confirmation
- **Debounced search**: Reduces unnecessary API calls
- **Pagination**: Only loads visible data

### User Experience

- **Loading states**: Skeleton loaders for better perceived performance
- **Error handling**: User-friendly error messages with retry options
- **Toast notifications**: Non-intrusive feedback for actions
- **Responsive design**: Works on desktop and tablet devices
- **Keyboard navigation**: Accessible interactions

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── MetricCard.tsx
│   │   │   ├── OrdersChart.tsx
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── StatusChart.tsx
│   │   │   └── SyncButton.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   │   └── useOrders.ts     # React Query hooks for orders
│   ├── lib/
│   │   ├── api.ts           # API client configuration
│   │   └── utils.ts         # Utility functions
│   ├── types/
│   │   └── order.ts         # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
└── ...config files
```

## API Integration

The frontend communicates with the backend API through a centralized API client (`src/lib/api.ts`). All endpoints are typed with TypeScript for type safety.

**Endpoints used:**

- `GET /api/orders` - List orders (paginated)
- `GET /api/orders/summary` - Analytics summary
- `GET /api/orders/{order_id}` - Get single order
- `PATCH /api/orders/{order_id}` - Update order
- `POST /api/orders/sync` - Sync from Airtable
- `GET /health` - Backend health check

## State Management

- **React Query** handles all server state (fetching, caching, synchronization)
- **React hooks** for local UI state (search, filters, pagination)
- **Query invalidation** ensures data consistency after mutations

## Styling

This project uses **Tailwind CSS v4** with the modern `@import` syntax. Component styles use Tailwind utility classes and CSS variables for theming.

**Theme customization** is available in `src/app.css` using CSS variables for colors, spacing, and other design tokens.
