"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Mengecek token di localStorage setiap kali rute berubah
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/generate", label: "Perencana AI" },
    { href: "/assistant", label: "Asisten AI" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo KelanaAI */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-sm font-extrabold">K</span>
          KelanaAI
        </Link>

        {/* Menu Navigasi */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-emerald-600 font-bold border-b-2 border-emerald-600"
                    : "hover:text-emerald-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <>
              <Link
                href="/trips"
                className={`transition-colors py-1 ${
                  pathname === "/trips"
                    ? "text-emerald-600 font-bold border-b-2 border-emerald-600"
                    : "hover:text-emerald-600"
                }`}
              >
                Riwayat Trip
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`transition-colors ${
                  pathname === "/login" ? "text-emerald-600 font-bold" : "hover:text-emerald-600"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}