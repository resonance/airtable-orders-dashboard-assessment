import { OrdersChart } from "./components/dashboard/OrdersChart";
import { OrdersTable } from "./components/dashboard/OrdersTable";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { DashboardLayout } from "./layouts/DashboardLayout";

function App() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SummaryCards />
        <OrdersChart />
        <OrdersTable />
      </div>
    </DashboardLayout>
  );
}

export default App;
