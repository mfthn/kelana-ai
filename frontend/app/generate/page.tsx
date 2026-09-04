"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createTrip } from "@/services/tripService";

function UnifiedPlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form Parameters
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<number>(1000000);
  const [currency, setCurrency] = useState("IDR");
  const [travelMonth, setTravelMonth] = useState("June");
  const [category, setCategory] = useState("Culinary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Quick Prompt / Chat State
  const [chatLog, setChatLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Halo! Saya Asisten KelanaAI. Silakan atur parameter di panel kiri, atau tanyakan rekomendasi spesifik di sini!",
    },
  ]);

  // Read URL Query Params
  useEffect(() => {
    const qDest = searchParams.get("destination");
    const qDays = searchParams.get("days");
    const qBudget = searchParams.get("budget");
    const qCurrency = searchParams.get("currency");

    if (qDest) setDestination(qDest);
    if (qDays) setDays(Number(qDays) || 3);
    if (qBudget) setBudget(Number(qBudget) || 1000000);
    if (qCurrency) setCurrency(qCurrency);
  }, [searchParams]);

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
      setError(err.message || "Gagal menyusun itinerary. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuickPrompt = (text: string) => {
    setChatLog((prev) => [...prev, { role: "user", text }]);
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Siap! Catatan "${text}" telah saya pertimbangkan. Klik tombol "Generate Itinerary" di panel kiri untuk mulai menyusun itinerary lengkap Anda.`,
        },
      ]);
    }, 600);
  };

  // Dynamic Image Resolver dengan Kata Kunci Fleksibel & Awalan Huruf
  const getDestinationImage = () => {
    const dest = destination.toLowerCase().trim();

    if (!dest) {
      return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200";
    }

    // Pemetaan berbasis awalan kata kunci & nama kota/negara
    if (dest.includes("tok") || dest.includes("jepang") || dest.includes("japan")) {
      return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200";
    }
    if (dest.includes("bal")) {
      return "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200";
    }
    if (dest.includes("kyo") || dest.includes("osaka")) {
      return "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1200";
    }
    if (dest.includes("par") || dest.includes("prancis") || dest.includes("france")) {
      return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200";
    }
    if (dest.includes("lon") || dest.includes("inggris") || dest.includes("uk")) {
      return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200";
    }
    if (dest.includes("ny") || dest.includes("new york") || dest.includes("usa")) {
      return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200";
    }
    if (dest.includes("sing") || dest.includes("sg")) {
      return "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200";
    }
    if (dest.includes("bangk") || dest.includes("thai")) {
      return "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200";
    }
    if (dest.includes("jog") || dest.includes("yog")) {
      return "https://images.unsplash.com/photo-1584441405886-bc21b61e420b?q=80&w=1200";
    }
    if (dest.includes("jak")) {
      return "https://images.unsplash.com/photo-1555899434-94d1368aa7af?q=80&w=1200";
    }
    if (dest.includes("band")) {
      // URL Unsplash Bandung baru yang stabil
      return "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200";
    }
    if (dest.includes("swis") || dest.includes("switzerland")) {
      return "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200";
    }
    if (dest.includes("ice") || dest.includes("islandia")) {
      return "https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1200";
    }
    if (dest.includes("labuan") || dest.includes("bajo") || dest.includes("komodo")) {
      return "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1200";
    }

    // Default Fallback Photo
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200";
  };

  const currentImage = getDestinationImage();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-900 relative overflow-hidden py-10 text-slate-100">
      
      {/* Background Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PANEL KIRI: Form Parameters (5 Cols) */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 sticky top-24">
            <div className="mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 border border-emerald-300/60 px-3 py-1 rounded-full">
                ✨ Parameter Perjalanan
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Mari Susun Perjalananmu!
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Atur parameter dasar di bawah untuk membuat draf itinerari otomatis.
              </p>
            </div>

            {error && (
              <div className="p-3.5 mb-4 bg-red-50 text-red-600 border border-red-200 text-xs rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Destinasi Tujuan
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder-slate-400 text-sm font-medium"
                  placeholder="Coba ketik: Bandung, Bali, Tokyo, Paris..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Durasi (Hari)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Bulan Keberangkatan
                  </label>
                  <select
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-medium"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Total Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Mata Uang
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-medium"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Gaya Perjalanan
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-medium"
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
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-emerald-600/30 text-sm"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Menyusun Itinerari...</span>
                  </>
                ) : (
                  <span>Generate Itinerary ✨</span>
                )}
              </button>
            </form>
          </div>

          {/* PANEL KANAN: Visual Hero Banner + Interactive Chat (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Dynamic Cover Card */}
            <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group">
              <img
                key={currentImage}
                src={currentImage}
                alt="Destination Visual Preview"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200";
                }}
                className="w-full h-full object-cover opacity-70 transition-all duration-500 ease-in-out animate-fadeIn"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                  Preview Destinasi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
                  {destination || "Eksplorasi Dunia Tanpa Batas"}
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {days} Hari • Budget {currency} {budget.toLocaleString()} • {category}
                </p>
              </div>
            </div>

            {/* AI Assistant Chat Panel */}
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col h-[380px] text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg shadow-inner">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Asisten Diskusi KelanaAI</h3>
                    <p className="text-[11px] text-slate-500">Sesuaikan preferensi perjalanan Anda secara real-time</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs pr-1">
                {chatLog.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white rounded-br-none shadow-md"
                          : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="py-2 flex gap-2 overflow-x-auto text-[11px] border-t border-slate-200/80 pt-3">
                <button
                  type="button"
                  onClick={() => handleSendQuickPrompt("Cari kuliner halal setempat")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 whitespace-nowrap transition-all font-medium border border-slate-200/60"
                >
                  🍜 Kuliner Halal
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuickPrompt("Rekomendasikan transportasi hemat")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 whitespace-nowrap transition-all font-medium border border-slate-200/60"
                >
                  🎫 Pass / Transport Hemat
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuickPrompt("Tambahkan tempat wisata tersembunyi (hidden gems)")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 whitespace-nowrap transition-all font-medium border border-slate-200/60"
                >
                  💎 Hidden Gems
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function GenerateTripPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
          Memuat Workspace Perencana AI...
        </div>
      }>
        <UnifiedPlannerContent />
      </Suspense>
    </ProtectedRoute>
  );
}