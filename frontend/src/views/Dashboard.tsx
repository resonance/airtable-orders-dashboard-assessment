import Header from "../components/Header";
import SummaryMetrics from "../components/SummaryMetrics";
import StatusChart from "../components/StatusChart";
import TotalsChart from "../components/TotalsChart";
import OrdersTable from "../components/OrdersTable";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
        <SummaryMetrics />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart />
          <TotalsChart />
        </div>
        <OrdersTable />
      </main>
    </div>
  );
}

export default Dashboard;
