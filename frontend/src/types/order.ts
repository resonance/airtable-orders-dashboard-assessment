export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderPriority = "Low" | "Medium" | "High";

export interface Order {
  id: string;
  order_id: string;
  customer: string;
  status: OrderStatus;
  order_total: number;
  created_at: string;
  updated_at: string;
  priority: OrderPriority;
}

export interface OrderUpdate {
  status?: OrderStatus;
  priority?: OrderPriority;
}

export interface OrderSummary {
  total_orders: number;
  count_by_status: Record<string, number>;
  total_by_status: Record<string, number>;
  orders_per_day: Array<{ date: string; count: number }>;
  last_synced_at: string | null;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
