import { OrdersTable } from "./components/OrdersTable";
import { PiorityChart } from "./components/PiorityChart";
import { VolumeChart } from "./components/VolumeChart";

export default function App() {
  return (
    <>
      <div style={{ padding: 24 }}>
        <h2>Orders</h2>
        <OrdersTable />
      </div>

      <div style={{ padding: 20 }}>
        <h2>Piority</h2>
        <PiorityChart />

        <h2>Volume</h2>
        <VolumeChart />
      </div>
    </>
  );
}
