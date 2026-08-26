"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: "Kyoto, Japan",
    days: 5,
    budget: 2000,
    currency: "USD",
    travelMonth: "October",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // trigger backend trip creation & AI generation
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* top navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-500/30">
              K
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900">
              Kelana<span className="text-emerald-600">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#explore" className="hover:text-emerald-600 transition-colors">Destinasi</a>
            <a href="#planner" className="hover:text-emerald-600 transition-colors">Perencana AI</a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">Tentang</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* hero section */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
              alt="Kyoto Japan Hero"
              className="w-full h-full object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-28 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
              ✨ Smart Itinerary Engine
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none max-w-3xl">
              Rancang Liburan Impian Tanpa Ribet
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl">
              Susun rencana perjalanan terstruktur mulai dari aktivitas harian, kuliner lokal, hingga estimasi biaya sesuai kebutuhan Anda.
            </p>
          </div>
        </section>

        {/* trip form card (floating overlap on desktop) */}
        <section id="planner" className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 mb-16">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Buat Rencana Perjalanan Baru</h2>
              <p className="text-sm text-slate-500 mt-0.5">Isi detail perjalanan untuk memulai rekomendasi otomatis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* responsive grid form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Destinasi Tujuan
                  </label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="mis. Tokyo, Japan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Durasi (Hari)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Bulan Keberangkatan
                  </label>
                  <select
                    value={form.travelMonth}
                    onChange={(e) => setForm({ ...form, travelMonth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 bg-white"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Total Anggaran
                    </label>
                    <input
                      type="number"
                      min="50"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Mata Uang
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 bg-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="IDR">IDR (Rp)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyusun Rencana...</span>
                      </>
                    ) : (
                      <span>Susun Itinerari ✨</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* highlight features */}
        <section id="explore" className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="text-center sm:text-left mb-8">
            <h3 className="text-lg font-bold text-slate-900">Kenapa Memilih KelanaAI?</h3>
            <p className="text-sm text-slate-500">Kombinasi fleksibilitas AI dan kepraktisan manajemen perjalanan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                🗺️
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Jadwal Harian Terstruktur</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Aktivitas pagi, siang, dan malam tersusun otomatis tanpa perlu riset manual berjam-jam.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
                💰
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Optimalisasi Budget</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Rekomendasi disesuaikan dengan alokasi pengeluaran harian dan kategori gaya liburan Anda.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                🍜
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Rekomendasi Kuliner & Rute</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Dapatkan opsi kuliner otentik di sekitar destinasi beserta opsi transportasi yang efisien.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* footer section */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm mt-auto">
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
              <a href="#planner" className="hover:text-emerald-600 transition-colors">Perencana</a>
              <a href="#explore" className="hover:text-emerald-600 transition-colors">Fitur</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Panduan</a>
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