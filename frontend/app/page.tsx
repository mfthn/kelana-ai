"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  tag: string;
  days: number;
  budget: number;
  currency: string;
}

const DESTINATIONS: Destination[] = [
  // --- ASIA ---
  {
    id: "1",
    name: "Kyoto",
    country: "Jepang",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
    tag: "Budaya & Warisan",
    days: 5,
    budget: 2000,
    currency: "USD",
  },
  {
    id: "3",
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
    tag: "Pantai & Relaksasi",
    days: 3,
    budget: 500,
    currency: "USD",
  },
  {
    id: "7",
    name: "Tokyo",
    country: "Jepang",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800",
    tag: "Metropolitan & Kuliner",
    days: 6,
    budget: 2400,
    currency: "USD",
  },
  {
    id: "8",
    name: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800",
    tag: "Kuliner & Belanja",
    days: 4,
    budget: 800,
    currency: "USD",
  },

  // --- EROPA ---
  {
    id: "2",
    name: "Santorini",
    country: "Yunani",
    continent: "Eropa",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800",
    tag: "Romantis & Pemandangan",
    days: 4,
    budget: 2200,
    currency: "USD",
  },
  {
    id: "4",
    name: "Swiss Alps",
    country: "Swiss",
    continent: "Eropa",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800",
    tag: "Petualangan Alam",
    days: 7,
    budget: 3500,
    currency: "USD",
  },
  {
    id: "9",
    name: "Paris",
    country: "Prancis",
    continent: "Eropa",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
    tag: "Seni & Romantis",
    days: 5,
    budget: 2600,
    currency: "USD",
  },
  {
    id: "10",
    name: "Roma",
    country: "Italia",
    continent: "Eropa",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800",
    tag: "Sejarah & Kuliner",
    days: 4,
    budget: 1900,
    currency: "USD",
  },

  // --- AMERIKA ---
  {
    id: "5",
    name: "New York",
    country: "Amerika Serikat",
    continent: "Amerika",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800",
    tag: "Kota & Belanja",
    days: 5,
    budget: 2800,
    currency: "USD",
  },
  {
    id: "11",
    name: "Rio de Janeiro",
    country: "Brasil",
    continent: "Amerika",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800",
    tag: "Karnaval & Pantai",
    days: 5,
    budget: 1700,
    currency: "USD",
  },
  {
    id: "12",
    name: "Machu Picchu",
    country: "Peru",
    continent: "Amerika",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800",
    tag: "Situs Kuno & Trekking",
    days: 4,
    budget: 1500,
    currency: "USD",
  },
  {
    id: "13",
    name: "Banff",
    country: "Kanada",
    continent: "Amerika",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800",
    tag: "Danau & Pegunungan",
    days: 5,
    budget: 2100,
    currency: "USD",
  },

  // --- AFRIKA ---
  {
    id: "6",
    name: "Cairo",
    country: "Mesir",
    continent: "Afrika",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800",
    tag: "Sejarah Kuno",
    days: 6,
    budget: 1800,
    currency: "USD",
  },
  {
    id: "14",
    name: "Cape Town",
    country: "Afrika Selatan",
    continent: "Afrika",
    image: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=800",
    tag: "Alam & Pesisir",
    days: 5,
    budget: 1600,
    currency: "USD",
  },
  {
    id: "15",
    name: "Marrakech",
    country: "Maroko",
    continent: "Afrika",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800",
    tag: "Eksotis & Pasar Kuno",
    days: 4,
    budget: 1200,
    currency: "USD",
  },
  {
    id: "16",
    name: "Serengeti",
    country: "Tanzania",
    continent: "Afrika",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800",
    tag: "Safari & Satwa Liar",
    days: 5,
    budget: 2500,
    currency: "USD",
  },
];

const CONTINENTS = ["Semua", "Asia", "Eropa", "Amerika", "Afrika"];

export default function HomePage() {
  const router = useRouter();
  const [selectedContinent, setSelectedContinent] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = DESTINATIONS.filter((dest) => {
    const matchesContinent =
      selectedContinent === "Semua" || dest.continent === selectedContinent;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const handleSelectDestination = (dest: Destination) => {
    const params = new URLSearchParams({
      destination: `${dest.name}, ${dest.country}`,
      days: dest.days.toString(),
      budget: dest.budget.toString(),
      currency: dest.currency,
    });
    router.push(`/generate?${params.toString()}`);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/generate");
      return;
    }
    router.push(`/generate?destination=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-24 sm:py-32">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop"
              alt="World Travel Hero"
              className="w-full h-full object-cover object-center opacity-35 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-6">
              ✨ Smart AI Itinerary Engine
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
              Jelajahi Dunia Sesuai Gaya Impianmu
            </h1>
            <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
              Pilih destinasi ikonik di bawah atau ketik kota tujuan untuk mulai merancang itinerari otomatis berbasis AI.
            </p>

            {/* Quick Search Box */}
            <form onSubmit={handleCustomSearch} className="mt-8 max-w-xl mx-auto flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                placeholder="Cari kota atau negara (mis. Paris, Tokyo, Bali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-300 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                Rencanakan ➔
              </button>
            </form>
          </div>
        </section>

        {/* Destination Gallery Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Eksplorasi Destinasi Populer</h2>
              <p className="text-sm text-slate-500 mt-1">
                Pilih tempat favorit Anda untuk membuat jadwal perjalanan instan.
              </p>
            </div>

            {/* Continent Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CONTINENTS.map((continent) => (
                <button
                  key={continent}
                  onClick={() => setSelectedContinent(continent)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedContinent === continent
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSelectDestination(dest)}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/60 flex flex-col justify-between p-6 bg-slate-900"
              >
                {/* Card Background Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {dest.tag}
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {dest.continent}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 text-white">
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">{dest.country}</p>
                  <h3 className="text-2xl font-extrabold mt-1 group-hover:text-emerald-300 transition-colors">
                    {dest.name}
                  </h3>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-slate-200">
                    <span>Estimasi: {dest.days} Hari</span>
                    <span className="font-semibold text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Buat Itinerari ➔
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Section */}
        <section id="explore" className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="text-center sm:text-left mb-8">
            <h3 className="text-xl font-bold text-slate-900">Kenapa Memilih KelanaAI?</h3>
            <p className="text-sm text-slate-500 mt-1">
              Kombinasi fleksibilitas AI dan kepraktisan manajemen perjalanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
                🗺️
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Jadwal Harian Terstruktur</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Aktivitas pagi, siang, dan malam tersusun otomatis tanpa perlu riset manual berjam-jam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl mb-4">
                💰
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Optimalisasi Budget</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Rekomendasi disesuaikan dengan alokasi pengeluaran harian dan kategori gaya liburan Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                🍜
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Rekomendasi Kuliner & Rute</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Dapatkan opsi kuliner otentik di sekitar destinasi beserta opsi transportasi yang efisien.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer id="about" className="bg-white border-t border-slate-200 text-slate-600 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                K
              </div>
              <span className="font-semibold text-slate-900">KelanaAI</span>
              <span className="text-slate-400 text-xs ml-2">Personal AI Travel Planner</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
              <a href="/generate" className="hover:text-emerald-600 transition-colors">Perencana AI</a>
              <a href="#explore" className="hover:text-emerald-600 transition-colors">Fitur</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Kebijakan Privasi</a>
            </div>

            <p className="text-xs text-slate-400">
              © 2026 KelanaAI. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}