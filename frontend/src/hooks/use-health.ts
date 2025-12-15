import { healthService } from "@/services/health";
import { useQuery } from "@tanstack/react-query";

export const useHealthStatus = () => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await healthService.getHealthStatus();
      return response;
    },
  });
};
