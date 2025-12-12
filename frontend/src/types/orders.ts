export const OrderStatus = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderPriority = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

export type OrderPriority = (typeof OrderPriority)[keyof typeof OrderPriority];

export interface Order {
  airtable_id: string;
  order_id: string;
  customer: string;
  status: OrderStatus;
  priority: OrderPriority;
  order_total: number;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface OrdersListResponse {
  data: Order[];
  meta: PaginationMeta;
}

export interface OrdersListParams {
  page?: number;
  page_size?: number;
}

export interface OrderResponse {
  data: Order;
}

export interface OrderUpdate {
  status?: OrderStatus;
  priority?: OrderPriority;
}

export interface OrderUpdateResponse {
  data: Order;
}

export interface StatusSummary {
  status: string;
  count: number;
  total_revenue: number;
}

export interface DailySummary {
  date: string;
  count: number;
}

export interface AnalyticsData {
  total_orders: number;
  total_revenue: number;
  by_status: StatusSummary[];
  last_30_days: DailySummary[];
}

export interface OrdersSummaryResponse {
  data: AnalyticsData;
}

export interface SyncData {
  success: boolean;
  message: string;
  records_synced: number;
  summary: AnalyticsData;
}

export interface SyncResponse {
  data: SyncData;
}
