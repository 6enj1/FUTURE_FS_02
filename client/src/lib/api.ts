import { getToken, clearToken } from "./auth";
import type { ApiResponse, ApiError } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

class ApiClient {
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearToken();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const body = await response.json();

    if (!response.ok) {
      const err = body as ApiError;
      throw new Error(err.error?.message || "Request failed");
    }

    return (body as ApiResponse<T>).data;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, data: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  patch<T>(path: string, data: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(path: string) {
    return this.request<void>(path, { method: "DELETE" });
  }
}

export const api = new ApiClient();
