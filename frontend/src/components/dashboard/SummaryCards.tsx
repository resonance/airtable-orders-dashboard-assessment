import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderSummary } from "@/hooks/use-orders";
import type { OrderStatus } from "@/types/orders";
import {
  DollarSign,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  Pending: "text-yellow-600",
  Processing: "text-blue-600",
  Shipped: "text-purple-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

export function SummaryCards() {
  const { data: summary, isLoading, error } = useOrderSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        Error loading summary: {error.message}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.data.total_orders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {summary.data.total_revenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Total sales value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.data.by_status
                .find((s) => s.status === "Delivered")
                ?.count.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {["Pending", "Processing", "Shipped"]
                .reduce((acc, status) => {
                  const statusData = summary.data.by_status.find(
                    (s) => s.status === status
                  );
                  return acc + (statusData ? statusData.count : 0);
                }, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending + Processing + Shipped
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {summary.data.by_status.map((status) => (
              <div
                key={status.status}
                className="flex flex-col space-y-1 border-l-4 pl-3"
                style={{
                  borderColor:
                    statusColors[status.status as keyof typeof statusColors],
                }}
              >
                <span className="text-sm font-medium text-gray-500">
                  {status.status}
                </span>
                <span className="text-2xl font-bold">
                  {status.count.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  $
                  {status.total_revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
