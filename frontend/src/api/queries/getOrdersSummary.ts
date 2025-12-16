import client from "../client";
import { OrderSummary } from "../../types/order";

export default async function getOrdersSummary(): Promise<OrderSummary> {
  const response = await client.get<OrderSummary>("/api/orders/summary");
  return response.data;
}
