import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Real-time order tracking from Airtable
            </p>
          </div>

          <Button
            onClick={() => {
              console.log("Syncing...");
            }}
            variant="outline"
            className="gap-2"
          >
            <>
              <RefreshCw className="h-4 w-4" />
              Sync from Airtable
            </>
          </Button>
        </div>
      </div>
    </header>
  );
}
