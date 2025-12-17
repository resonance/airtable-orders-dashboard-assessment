import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../service/order.service";
import type { Order, OrdersResponse } from "../types/orders";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  async function loadOrders(page: number) {
    try {
      setLoading(true);
      setError(null);

      const data: OrdersResponse = await getOrders(page);

      setOrders(data.data ?? []);
      setTotal(data.pagination.total ?? 0);
      setTotalPages(data.pagination.total_pages ?? 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(orderId: string, field: "status" | "priority", value: string) {
    try {
      const updated = await updateOrder(orderId, { [field]: value });
      setOrders((prev) =>
        prev.map((o) => (o.record_id === orderId ? { ...o, [field]: updated[field] } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  }

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Total</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.record_id}>
                <td>{order.order_id}</td>
                <td>{order.customer}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdate(order.record_id, "status", e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={order.priority}
                    onChange={(e) => handleUpdate(order.record_id, "priority", e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
                <td>${order.order_total.toFixed(2)}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
