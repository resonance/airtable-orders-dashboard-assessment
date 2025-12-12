import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/use-orders";
import { OrderPriority, OrderStatus } from "@/types/orders";
import { ChevronLeft, ChevronRight, Edit, Loader2 } from "lucide-react";
import { useState } from "react";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const priorityColors: Record<OrderPriority, string> = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-orange-100 text-orange-800",
  High: "bg-red-100 text-red-800",
};

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { data, isLoading, error } = useOrders({ page, page_size: pageSize });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            Error loading orders: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { data: orders, meta } = data;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Showing 100 of 2050 total orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                    Order ID
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                    Customer
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                    Status
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                    Priority
                  </TableHead>
                  <TableHead className="text-right cursor-pointer select-none hover:bg-gray-50">
                    Total
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                    Created
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.airtable_id}>
                    <TableCell className="font-medium">
                      {order.order_id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[order.status]}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={priorityColors[order.priority]}
                      >
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.order_total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("Edit", order);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-500">
              Page {meta.page} of {meta.total_pages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((page) => Math.max(page - 1, 1))}
                disabled={meta.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((page) => page + 1)}
                disabled={meta.page === meta.total_pages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
