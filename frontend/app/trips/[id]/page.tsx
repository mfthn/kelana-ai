"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTrip, Trip } from "@/services/tripService";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      getTrip(params.id as string)
        .then((data) => setTrip(data))
        .catch((err) => console.error("Error fetching trip:", err))
        .finally(() => setLoading(false));
    }
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Memuat itinerary perjalanan...
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-medium">Itinerary tidak ditemukan.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Trips
      </button>

      {/* Main Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Trip Itinerary
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {trip.destination}
            </h1>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">CATEGORY</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">{trip.category || "-"}</span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">TRAVEL MONTH</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">{trip.travel_month || "-"}</span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">BUDGET</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              {trip.currency || "USD"} {Number(trip.budget).toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">DURATION</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">{trip.days} Days</span>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-900">AI Recommendation</h2>
          </div>

          {trip.ai_recommendation ? (
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-6 md:p-8 text-slate-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-lg font-bold text-indigo-900 mt-6 mb-3 flex items-center gap-2" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-md font-semibold text-slate-800 mt-4 mb-2" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside space-y-2 my-3 text-slate-600 pl-2" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-semibold text-slate-900" {...props} />
                  ),
                  hr: ({ ...props }) => (
                    <hr className="my-6 border-slate-200/80" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-3 last:mb-0" {...props} />
                  )
                }}
              >
                {trip.ai_recommendation}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-6 bg-amber-50/60 border border-amber-200/80 rounded-xl text-amber-800 text-sm">
              Rekomendasi itinerary sedang disiapkan atau belum tersedia.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}