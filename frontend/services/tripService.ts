import { apiFetch } from "./api";

export interface TripInput {
  destination: string;
  days: number;
  budget: number;
  currency?: string;
  travel_month?: string;
  category?: string;
}

export interface Trip {
  id: number | string;
  destination: string;
  days: number;
  budget: number | string;
  currency: string;
  travel_month?: string;
  category?: 'Backpacker' | 'Standard' | 'Luxury' | string;
  daily_budget?: number;
  season?: string;
  ai_recommendation?: string;
  
  // Field opsional untuk UI frontend
  travel_style?: string;
  recommendation?: any;
  duration?: string;
  status?: string;
  createdAt?: string;
  description?: string;
  itinerary?: {
    day: number;
    title: string;
    activities: string[];
  }[];
}

export async function getTrips(): Promise<Trip[]> {
  const res = await apiFetch("/trips");
  if (!res.ok) throw new Error("Gagal mengambil data trip");
  return res.json();
}

export async function getTrip(id: string | number): Promise<Trip> {
  const res = await apiFetch(`/trips/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil detail trip");
  return res.json();
}

export async function createTrip(data: TripInput): Promise<Trip> {
  const payload = {
    ...data,
    currency: data.currency || "IDR",
    travel_month: data.travel_month || "Januari",
  };

  const res = await apiFetch("/trips", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Error Detail dari Backend:", errData);
    throw new Error(errData.detail || "Gagal membuat rekomendasi perjalanan");
  }

  return res.json();
}

export async function updateTripBudget(id: number | string, budget: number): Promise<Trip> {
  const res = await apiFetch(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify({ budget }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal memperbarui budget trip");
  }

  return res.json();
}

export async function deleteTrip(id: number | string): Promise<{ message: string }> {
  const res = await apiFetch(`/trips/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal menghapus trip");
  }

  return res.json();
}

// Export alias untuk backward-compatibility
export const generateTrip = createTrip;