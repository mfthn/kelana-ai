"use client";

import { useState } from "react";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  tripsPlanned: number;
  favoriteContinent: string;
  preferredCurrency: string;
  travelStyle: string;
}

export default function ProfilePage() {
  // Mock data profil pengguna contoh
  const [profile] = useState<UserProfile>({
    name: "Pengguna Kelana",
    email: "user@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    memberSince: "Januari 2026",
    tripsPlanned: 12,
    favoriteContinent: "Asia",
    preferredCurrency: "USD ($)",
    travelStyle: "Budaya & Petualangan",
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Profil Saya
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola informasi pribadi dan preferensi perjalanan Anda di KelanaAI.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-md shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="inline-block px-3 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full uppercase tracking-wider">
              Petualang Aktif
            </span>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <p className="text-xs text-slate-400 pt-1">
              Anggota sejak {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Travel Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-slate-500">Itinerari Dibuat</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {profile.tripsPlanned} Perjalanan
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-slate-500">Benua Favorit</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {profile.favoriteContinent}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-slate-500">Gaya Liburan</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {profile.travelStyle}
            </p>
          </div>
        </div>

        {/* Settings & Preferences Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base">
              Preferensi Perjalanan & Akun
            </h3>
          </div>
          <div className="p-6 divide-y divide-slate-100 text-sm">
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Mata Uang Utama</span>
              <span className="font-semibold text-slate-900">
                {profile.preferredCurrency}
              </span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Bahasa Asisten AI</span>
              <span className="font-semibold text-slate-900">
                Bahasa Indonesia
              </span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">
                Notifikasi AI Planner
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}