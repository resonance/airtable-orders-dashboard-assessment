import { OrdersProvider } from "./hooks/useOrders";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <OrdersProvider>
      <Dashboard />
    </OrdersProvider>
  );
}

export default App;
