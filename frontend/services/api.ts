const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const defaultHeaders = getAuthHeaders();
  
  // Memastikan endpoint selalu diawali dengan slash (/) untuk menghindari URL rusak
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