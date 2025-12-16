import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useOrders from "../hooks/useOrders";
import Card from "./Card";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Processing: "#3b82f6",
  Shipped: "#8b5cf6",
  Delivered: "#22c55e",
  Cancelled: "#ef4444",
};

function StatusChart() {
  const { summary, summaryLoading } = useOrders();

  if (summaryLoading || !summary) {
    return (
      <Card>
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
      </Card>
    );
  }

  const data = Object.entries(summary.count_by_status).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Orders by Status
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, "Orders"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: STATUS_COLORS[entry.name] }}
            />
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default StatusChart;
