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
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const priorityColors = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-orange-100 text-orange-800",
  High: "bg-red-100 text-red-800",
};

const orders = [
  {
    airtable_id: "rec1",
    order_id: "ORD-1001",
    customer: "John Doe",
    status: "Pending",
    priority: "High",
    order_total: 250.75,
    created_at: "2024-06-01T10:15:00Z",
  },
];

export function OrdersTable() {
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
                        className={
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          priorityColors[
                            order.priority as keyof typeof priorityColors
                          ]
                        }
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

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Page 1 of 21</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Previous page")}
                disabled={true}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Next page")}
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
