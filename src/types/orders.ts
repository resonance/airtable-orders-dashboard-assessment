export type OrdersSummary = {
  total_orders: number;
  pending: number;
  completed: number;
  high_priority: number;
  total_amount: number;
};

export type Order = {
  order_id: string;
  customer: string;
  status: string;
  priority: string;
  order_total: number;
  created_at: string;
  updated_at: string;
  record_id: string;
};

export type OrdersResponse = {
  total: number;
  page: number;
  page_size: number;
  items: Order[];
};

