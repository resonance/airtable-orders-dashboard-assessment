import { RefreshCw } from "lucide-react";
import useOrders from "../hooks/useOrders";
import Button from "./Button";

function formatLastSynced(dateString: string | null): string {
  if (!dateString) return "Never synced";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}

function Header() {
  const { syncOrders, syncing, lastSyncedAt } = useOrders();

  const handleSync = async () => {
    try {
      await syncOrders();
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Failed to sync with Airtable. Please try again.");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          OD
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Orders Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Last synced: {formatLastSynced(lastSyncedAt)}
        </span>
        <Button onClick={handleSync} loading={syncing}>
          <RefreshCw size={16} />
          {syncing ? "Syncing..." : "Sync with Airtable"}
        </Button>
      </div>
    </header>
  );
}

export default Header;
