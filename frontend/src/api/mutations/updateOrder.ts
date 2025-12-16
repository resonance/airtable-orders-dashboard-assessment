import client from "../client";
import { Order, OrderUpdate } from "../../types/order";

export default async function updateOrder(
  orderId: string,
  update: OrderUpdate
): Promise<Order> {
  const response = await client.patch<Order>(`/api/orders/${orderId}`, update);
  return response.data;
}
