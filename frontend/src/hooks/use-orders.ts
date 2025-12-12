import { ordersService } from "@/services/orders";
import type { OrdersListParams, OrderUpdate } from "@/types/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrders = (queryParams: OrdersListParams) => {
  return useQuery({
    queryKey: ["orders", queryParams],
    queryFn: async () => {
      const response = await ordersService.getOrders(queryParams);
      return response;
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await ordersService.getOrderById(orderId);
      return response;
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrderUpdate) => {
      const response = await ordersService.updateOrder(orderId, data);
      await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      return response;
    },
  });
};

export const useOrderSummary = () => {
  return useQuery({
    queryKey: ["order-summary"],
    queryFn: async () => {
      const response = await ordersService.getOrderSummary();
      return response;
    },
  });
};

export const useSyncOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await ordersService.syncOrders();
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["order-summary"] });
      return response;
    },
  });
};
