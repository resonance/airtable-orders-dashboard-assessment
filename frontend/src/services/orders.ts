import {
  type OrderResponse,
  type OrdersListParams,
  type OrdersListResponse,
  type OrdersSummaryResponse,
  type OrderUpdate,
  type OrderUpdateResponse,
  type SyncResponse,
} from "@/types/orders";
import { ApiService } from "./api";

class OrdersService extends ApiService {
  constructor() {
    super("api/orders");
  }

  async getOrders(params?: OrdersListParams) {
    return this.request<OrdersListResponse>({
      method: "GET",
      params,
    });
  }

  async getOrderById(orderId: string) {
    return this.request<OrderResponse>({
      method: "GET",
      path: `${orderId}`,
    });
  }

  async updateOrder(orderId: string, data: OrderUpdate) {
    return this.request<OrderUpdateResponse>({
      method: "PATCH",
      path: `${orderId}`,
      data,
    });
  }

  async getOrderSummary() {
    return this.request<OrdersSummaryResponse>({
      method: "GET",
      path: "summary",
    });
  }

  async syncOrders() {
    return this.request<SyncResponse>({
      method: "POST",
      path: "sync",
    });
  }
}

export const ordersService = new OrdersService();
