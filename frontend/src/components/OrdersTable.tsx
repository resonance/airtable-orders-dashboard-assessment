import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useOrders from "../hooks/useOrders";
import { Order, OrderStatus, OrderPriority } from "../types/order";
import Button from "./Button";
import Card from "./Card";

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PRIORITY_OPTIONS: OrderPriority[] = ["Low", "Medium", "High"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface EditableCellProps {
  order: Order;
  field: "status" | "priority";
  options: string[];
  onUpdate: (
    orderId: string,
    field: "status" | "priority",
    value: string
  ) => void;
  updating: boolean;
}

function EditableCell({
  order,
  field,
  options,
  onUpdate,
  updating,
}: EditableCellProps) {
  const currentValue = order[field];

  return (
    <select
      className="px-2 py-1 text-sm border border-gray-200 rounded bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      value={currentValue}
      onChange={(e) => onUpdate(order.id, field, e.target.value)}
      disabled={updating}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function OrdersTable() {
  const {
    orders,
    ordersLoading,
    page,
    pageSize,
    totalPages,
    totalOrders,
    filters,
    setFilters,
    setPage,
    updateOrder,
  } = useOrders();

  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  const handleUpdateOrder = async (
    orderId: string,
    field: "status" | "priority",
    value: string
  ) => {
    setUpdatingOrders((prev) => new Set(prev).add(orderId));
    try {
      await updateOrder(orderId, { [field]: value });
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order. Please try again.");
    } finally {
      setUpdatingOrders((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalOrders);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Orders ({totalOrders})
        </h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value || undefined })
            }
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
            value={filters.priority || ""}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value || undefined })
            }
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {ordersLoading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No orders found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Priority
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500">
                    Total
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">
                      {order.order_id}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {order.customer}
                    </td>
                    <td className="py-3 px-4">
                      <EditableCell
                        order={order}
                        field="status"
                        options={STATUS_OPTIONS}
                        onUpdate={handleUpdateOrder}
                        updating={updatingOrders.has(order.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <EditableCell
                        order={order}
                        field="priority"
                        options={PRIORITY_OPTIONS}
                        onUpdate={handleUpdateOrder}
                        updating={updatingOrders.has(order.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(order.order_total)}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {startRecord} to {endRecord} of {totalOrders} orders
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default OrdersTable;
