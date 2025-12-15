import type { HealthStatus } from "@/types/health";
import { ApiService } from "./api";

class HealthService extends ApiService {
  constructor() {
    super("");
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.request<HealthStatus>({
      method: "GET",
      path: "health",
    });
  }
}

export const healthService = new HealthService();
