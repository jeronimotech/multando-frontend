const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Extended request options to support different response types
interface ExtendedRequestOptions extends RequestInit {
  responseType?: "json" | "blob" | "text";
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async handleResponse<T>(
    response: Response,
    responseType: "json" | "blob" | "text" = "json"
  ): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const error: ApiError = isJson
        ? await response.json()
        : {
            message: response.statusText || "An error occurred",
            statusCode: response.status,
          };

      throw error;
    }

    // Handle different response types
    if (responseType === "blob") {
      return response.blob() as Promise<T>;
    }

    if (responseType === "text") {
      return response.text() as Promise<T>;
    }

    if (isJson) {
      return response.json();
    }

    return {} as T;
  }

  private async request<T>(
    endpoint: string,
    options: ExtendedRequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();
    const { responseType, ...fetchOptions } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response, responseType);
  }

  async get<T>(endpoint: string, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: HeadersInit = {};
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

/**
 * Authority API Client
 * Uses API key authentication for authority endpoints
 */
class AuthorityApiClient {
  private baseUrl: string;
  private apiKey: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the API key for authentication
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Clear the API key
   */
  clearApiKey(): void {
    this.apiKey = null;
  }

  /**
   * Get the current API key
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  private async handleResponse<T>(
    response: Response,
    responseType: "json" | "blob" | "text" = "json"
  ): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      // Handle 401 Unauthorized - clear API key and trigger re-auth
      if (response.status === 401) {
        this.clearApiKey();
        // Dispatch custom event for auth state management
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("authority-unauthorized"));
        }
      }

      const error: ApiError = isJson
        ? await response.json()
        : {
            message: response.statusText || "An error occurred",
            statusCode: response.status,
          };

      throw error;
    }

    // Handle different response types
    if (responseType === "blob") {
      return response.blob() as Promise<T>;
    }

    if (responseType === "text") {
      return response.text() as Promise<T>;
    }

    if (isJson) {
      return response.json();
    }

    return {} as T;
  }

  private async request<T>(
    endpoint: string,
    options: ExtendedRequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { responseType, ...fetchOptions } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    // Add API key to headers if available
    if (this.apiKey) {
      (headers as Record<string, string>)["X-API-Key"] = this.apiKey;
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response, responseType);
  }

  async get<T>(endpoint: string, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Main API client for user authentication
export const api = new ApiClient(API_BASE_URL);

// Authority API client for API key authentication
export const authorityApi = new AuthorityApiClient(API_BASE_URL);

/**
 * Set the authority API key
 */
export function setAuthorityApiKey(apiKey: string): void {
  authorityApi.setApiKey(apiKey);
}

/**
 * Clear the authority API key
 */
export function clearAuthorityApiKey(): void {
  authorityApi.clearApiKey();
}

/**
 * Get the current authority API key
 */
export function getAuthorityApiKey(): string | null {
  return authorityApi.getApiKey();
}

// Re-export for convenience
export default api;
