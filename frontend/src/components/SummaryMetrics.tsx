import useOrders from "../hooks/useOrders";
import Card from "./Card";

const STATUS_ORDER = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_BORDER_COLORS: Record<string, string> = {
  Pending: "border-l-amber-500",
  Processing: "border-l-blue-500",
  Shipped: "border-l-violet-500",
  Delivered: "border-l-green-500",
  Cancelled: "border-l-red-500",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function SummaryMetrics() {
  const { summary, summaryLoading } = useOrders();

  if (summaryLoading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-15 bg-gray-100 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  const totalAmount = Object.values(summary.total_by_status).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card
        title="Total Orders"
        value={formatNumber(summary.total_orders)}
        subtitle={formatCurrency(totalAmount)}
        className="border-l-4 border-l-blue-500"
      />
      {STATUS_ORDER.map((status) => {
        const count = summary.count_by_status[status] || 0;
        const total = summary.total_by_status[status] || 0;
        return (
          <Card
            key={status}
            title={status}
            value={formatNumber(count)}
            subtitle={formatCurrency(total)}
            className={`border-l-4 ${STATUS_BORDER_COLORS[status]}`}
          />
        );
      })}
    </div>
  );
}

export default SummaryMetrics;
