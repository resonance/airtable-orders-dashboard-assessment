import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderSummary } from "@/hooks/use-orders";
import { OrderStatus } from "@/types/orders";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  Pending: "text-yellow-600",
  Processing: "text-blue-600",
  Shipped: "text-purple-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

export function SummaryCards() {
  const {
    data: summary,
    isLoading,
    isFetching,
    error,
    isPending,
  } = useOrderSummary();

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        Error loading summary: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <h2>Total Orders</h2>
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetching || isLoading || isPending
                ? "..."
                : summary?.data.total_orders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <h2>Total Revenue</h2>
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetching || isLoading || isPending
                ? "..."
                : `$${summary?.data.total_revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
            <p className="text-xs text-muted-foreground">Total sales value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <h2>Delivered</h2>
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetching || isLoading || isPending
                ? "..."
                : summary?.data.by_status
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
            <CardTitle className="text-sm font-medium">
              <h2>In Progress</h2>
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetching || isLoading || isPending
                ? "..."
                : ["Pending", "Processing", "Shipped"]
                    .reduce((acc, status) => {
                      const statusData = summary?.data.by_status.find(
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
          <CardTitle>
            <h2>Orders by Status</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {Object.values(OrderStatus).map((status) => {
              const statusData = summary?.data.by_status.find(
                (s) => s.status === status
              );
              return (
                <div
                  key={status}
                  className="flex flex-col space-y-1 border-l-4 pl-3"
                  style={{
                    borderColor: statusColors[status],
                  }}
                >
                  <h3 className="text-sm font-medium text-gray-500">
                    {status}
                  </h3>
                  <span className="text-2xl font-bold">
                    {isFetching || isLoading || isPending
                      ? "..."
                      : statusData
                      ? statusData.count.toLocaleString()
                      : "0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isFetching || isLoading || isPending
                      ? "..."
                      : `${
                          statusData
                            ? statusData.total_revenue.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                            : "0.00"
                        }`}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
