import { Button } from "@/components/ui/button";
import { useHealthStatus } from "@/hooks/use-health";
import { useSyncOrders } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { Badge } from "./ui/badge";

const Alert = ({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) => {
  const baseClasses = cn(
    "mt-3 rounded-md p-3 text-sm flex items-center gap-1",
    type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
  );

  const Icon = type === "success" ? Check : X;

  return (
    <div className={baseClasses}>
      <Icon className="inline h-4 w-4" />
      {message}
    </div>
  );
};

const healthBadge = (status: string, text: string) => {
  return (
    <Badge
      variant="secondary"
      className="px-2 py-1 rounded-full text-sm font-medium flex gap-1 items-center capitalize"
    >
      <span
        className={cn("size-2 inline-block mr-1 rounded-full", {
          "bg-yellow-500 animate-pulse": status === "loading",
          "bg-green-500": status === "ok" || status === "connected",
          "bg-red-500": status === "error" || status === "disconnected",
        })}
      />
      {text}
    </Badge>
  );
};

export function Header() {
  const syncMutation = useSyncOrders();
  const { data: syncData, isPending, isError, isSuccess } = syncMutation;
  const {
    data: healthData,
    isPending: isHealthPending,
    isError: isHealthError,
  } = useHealthStatus();

  const handleSync = () => {
    syncMutation.mutate();
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Real-time order tracking from Airtable
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isHealthPending && healthBadge("loading", "Checking health...")}
              {isHealthError && healthBadge("error", "Service Unhealthy")}
              {healthData && (
                <>
                  {healthBadge(healthData.status, `API: ${healthData.status}`)}{" "}
                  {healthData.redis &&
                    healthBadge(healthData.redis, `Redis: ${healthData.redis}`)}
                </>
              )}
            </div>

            <Button
              onClick={handleSync}
              disabled={syncMutation.isPending}
              variant="outline"
              className="gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Sync from Airtable
                </>
              )}
            </Button>
          </div>
        </div>

        {isSuccess && <Alert type="success" message={syncData.data.message} />}

        {isError && (
          <Alert
            type="error"
            message={syncMutation.error?.message || "Unknown error"}
          />
        )}
      </div>
    </header>
  );
}
