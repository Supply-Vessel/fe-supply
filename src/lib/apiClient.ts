import { AuthService } from "./auth";

class ApiClient {

  baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = AuthService.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include' as RequestCredentials,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (response.status === 401) {
        AuthService.logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
