"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createTrip } from "@/services/tripService";

export default function GenerateTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<number>(1000000);
  const [currency, setCurrency] = useState("IDR");
  const [travelMonth, setTravelMonth] = useState("June");
  const [category, setCategory] = useState("Culinary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newTrip = await createTrip({
        destination,
        days: Number(days),
        budget: Number(budget),
        currency,
        travel_month: travelMonth,
        category,
      });

      router.push(`/trips/${newTrip.id}`);
    } catch (err: any) {
      setError(err.message || "Gagal membuat itinerary. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              AI Trip Planner
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Rencanakan Perjalanan Baru
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Isi parameter di bawah untuk membuat rekomendasi itinerary secara otomatis dengan AI.
            </p>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-200 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Destinasi
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: Tokyo, Bali, Paris"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Durasi (Hari)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Bulan Perjalanan
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Mata Uang
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Kategori Perjalanan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Culinary">Culinary & Foodie</option>
                <option value="Adventure">Adventure & Nature</option>
                <option value="Culture">Cultural & Historical</option>
                <option value="Relaxation">Relaxation & Beach</option>
                <option value="Shopping">Shopping & Urban</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generasi Rekomendasi AI...
                </>
              ) : (
                "Generate Itinerary ✨"
              )}
            </button>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}