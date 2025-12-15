class ApiService {
  private readonly baseUrl: string;
  private readonly resource: string;

  constructor(resource: string) {
    this.resource = resource;
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async request<T>({
    method = "GET",
    path = "",
    params,
    data,
  }: {
    method: string;
    path?: string;
    params?: object;
    data?: unknown;
  }): Promise<T> {
    const url = this.constructUrl(path, params);
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const result = await response.json();
    return result;
  }

  private transformQueries(queries: object): string {
    return Object.entries(queries)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  private constructUrl(path: string, queries?: object): string {
    const queryString = queries ? `?${this.transformQueries(queries)}` : "";
    const resource = this.resource ? `${this.resource}/` : "";
    const pathWithQueries = `${path}${queryString}`;
    return `${this.baseUrl}/${resource}${pathWithQueries}`;
  }
}

export { ApiService };
