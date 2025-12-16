import { OrderStatus, OrderPriority } from "../types/order";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-violet-100 text-violet-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const PRIORITY_COLORS: Record<OrderPriority, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: OrderPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${PRIORITY_COLORS[priority]}`}
    >
      {priority}
    </span>
  );
}
