import type { Order, OrdersResponse, OrdersSummary } from "../types/orders";

const API_URL_SUMARRY = "http://localhost:8000/api/orders/summary";
const API_URL_ORDERS = "http://localhost:8000/api/orders";



export async function getOrdersSummary(): Promise<OrdersSummary> {
  const response = await fetch(API_URL_SUMARRY);

  if (!response.ok) {
    throw new Error("Failed to fetch orders summary");
  }

  return response.json();
}

export async function getOrders(page: number): Promise<OrdersResponse> {
  const res = await fetch(`${API_URL_ORDERS}?page=${page}`);

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export async function updateOrder(
  recordId: string,
  payload: Partial<Pick<Order, "status" | "priority">>
): Promise<Order> {
  const res = await fetch(`${API_URL_ORDERS}/${recordId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update order");
  }

  return res.json();
}

