import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Order, OrderSummary, OrderUpdate } from "../types/order";
import getOrdersSummary from "../api/queries/getOrdersSummary";
import getOrders from "../api/queries/getOrders";
import syncOrdersApi from "../api/mutations/syncOrders";
import updateOrderApi from "../api/mutations/updateOrder";

interface OrdersFilters {
  status?: string;
  priority?: string;
}

interface OrdersContextType {
  summary: OrderSummary | null;
  summaryLoading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalOrders: number;
  filters: OrdersFilters;
  setFilters: (filters: OrdersFilters) => void;
  setPage: (page: number) => void;
  syncOrders: () => Promise<void>;
  updateOrder: (orderId: string, update: OrderUpdate) => Promise<void>;
  refreshOrders: () => Promise<void>;
  syncing: boolean;
  lastSyncedAt: string | null;
}

const defaultValues: OrdersContextType = {
  summary: null,
  summaryLoading: true,
  orders: [],
  ordersLoading: true,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  totalOrders: 0,
  filters: {},
  setFilters: () => {},
  setPage: () => {},
  syncOrders: async () => {},
  updateOrder: async () => {},
  refreshOrders: async () => {},
  syncing: false,
  lastSyncedAt: null,
};

const OrdersContext = createContext<OrdersContextType>(defaultValues);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState<OrdersFilters>({});
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getOrdersSummary();
      setSummary(data);
      setLastSyncedAt(data.last_synced_at);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders({
        page,
        pageSize,
        status: filters.status,
        priority: filters.priority,
      });
      setOrders(data.orders);
      setTotalPages(data.total_pages);
      setTotalOrders(data.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const syncOrders = async () => {
    setSyncing(true);
    try {
      const data = await syncOrdersApi();
      setSummary(data);
      setLastSyncedAt(data.last_synced_at);
      await fetchOrders();
    } catch (error) {
      console.error("Error syncing orders:", error);
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  const updateOrder = async (orderId: string, update: OrderUpdate) => {
    try {
      const updatedOrder = await updateOrderApi(orderId, update);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      await fetchSummary();
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const refreshOrders = async () => {
    await Promise.all([fetchSummary(), fetchOrders()]);
  };

  const handleSetFilters = (newFilters: OrdersFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <OrdersContext.Provider
      value={{
        summary,
        summaryLoading,
        orders,
        ordersLoading,
        page,
        pageSize,
        totalPages,
        totalOrders,
        filters,
        setFilters: handleSetFilters,
        setPage,
        syncOrders,
        updateOrder,
        refreshOrders,
        syncing,
        lastSyncedAt,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

const useOrders = () => useContext(OrdersContext);

export default useOrders;
