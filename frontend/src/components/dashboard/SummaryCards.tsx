import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const statusColors = {
  Pending: "text-yellow-600",
  Processing: "text-blue-600",
  Shipped: "text-purple-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

export function SummaryCards() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2050</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ 123456.78</div>
            <p className="text-xs text-muted-foreground">Total sales value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1500</div>
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
            <div className="text-2xl font-bold">400</div>
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
            {[
              { status: "Pending", count: 100, total_amount: 5000 },
              { status: "Processing", count: 150, total_amount: 7500 },
              { status: "Shipped", count: 150, total_amount: 9000 },
              { status: "Delivered", count: 1500, total_amount: 120000 },
              { status: "Cancelled", count: 150, total_amount: 3000 },
            ].map((status) => (
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
                  {status.total_amount.toLocaleString(undefined, {
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
