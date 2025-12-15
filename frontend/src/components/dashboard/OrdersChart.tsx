import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderSummary } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function OrdersChart() {
  const { data: summary, isLoading, isFetching, isPending } = useOrderSummary();

  if (summary?.data.last_30_days.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center text-gray-500">
          No order data available for the last 30 days.
        </CardContent>
      </Card>
    );
  }

  const chartData = summary?.data.last_30_days.map((item) => ({
    date: new Date(item.date).toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
    }),
    orders: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "relative",
          isFetching || isLoading || isPending ? "py-9" : ""
        )}
      >
        {isFetching || isLoading || isPending ? (
          <div className="absolute py-6 inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: -30, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
