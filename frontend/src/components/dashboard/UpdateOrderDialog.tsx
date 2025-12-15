import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateOrder } from "@/hooks/use-orders";
import { type Order, OrderPriority, OrderStatus } from "@/types/orders";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface UpdateOrderDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorities: OrderPriority[] = ["Low", "Medium", "High"];

export function UpdateOrderDialog({
  order,
  open,
  onOpenChange,
}: UpdateOrderDialogProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [priority, setPriority] = useState<OrderPriority>(order.priority);
  const updateMutation = useUpdateOrder(order.order_id);

  const handleSubmit = () => {
    updateMutation.mutate(
      { status, priority },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const hasChanges = status !== order.status || priority !== order.priority;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
          <DialogDescription>
            Update the status and priority for order {order.order_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <div className="text-sm text-gray-600">{order.customer}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order Total</label>
            <div className="text-sm text-gray-600">
              ${order.order_total.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as OrderPriority)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {updateMutation.isError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Error: {updateMutation.error.message}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
