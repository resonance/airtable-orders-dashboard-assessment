import client from "../client";
import { OrderSummary } from "../../types/order";

export default async function syncOrders(): Promise<OrderSummary> {
  const response = await client.post<OrderSummary>("/api/orders/sync");
  return response.data;
}
