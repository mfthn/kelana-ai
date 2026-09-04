// Gunakan 127.0.0.1 secara eksplisit untuk menghindari konflik IPv6 (::1) pada Windows
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const defaultHeaders = getAuthHeaders();
  
  // Memastikan endpoint selalu diawali dengan slash (/)
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Redirect 401 hanya jika user tidak sedang berada di halaman /login
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return res;
}

// Wrapper objek 'api' untuk mendukung pemanggilan method (api.get, api.post, dll) pada chatService.ts
export const api = {
  get: async <T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> => {
    const res = await apiFetch(endpoint, { method: "GET", ...options });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { response: { data: errorData, status: res.status } };
    }
    const data = await res.json();
    return { data };
  },

  post: async <T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<{ data: T }> => {
    const res = await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { response: { data: errorData, status: res.status } };
    }
    const data = await res.json();
    return { data };
  },

  patch: async <T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<{ data: T }> => {
    const res = await apiFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { response: { data: errorData, status: res.status } };
    }
    const data = await res.json();
    return { data };
  },

  delete: async <T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> => {
    const res = await apiFetch(endpoint, { method: "DELETE", ...options });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { response: { data: errorData, status: res.status } };
    }
    const data = await res.json();
    return { data };
  },
};

export default api;