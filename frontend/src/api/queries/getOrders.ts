import client from "../client";
import { PaginatedOrders } from "../../types/order";

interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
}

export default async function getOrders({
  page = 1,
  pageSize = 20,
  status,
  priority,
}: GetOrdersParams = {}): Promise<PaginatedOrders> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("page_size", String(pageSize));
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);

  const response = await client.get<PaginatedOrders>(
    `/api/orders?${params.toString()}`
  );
  return response.data;
}
