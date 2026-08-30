import Link from "next/link";
import { Trip } from "@/services/tripService";

const formatBudget = (amount: number, currency?: string) => {
  const num = Number(amount) || 0;
  switch (currency) {
    case "USD":
      return `$${num.toLocaleString("en-US")}`;
    case "JPY":
      return `¥${num.toLocaleString("ja-JP")}`;
    case "IDR":
      return `Rp ${num.toLocaleString("id-ID")}`;
    default:
      return `${currency || "Rp"} ${num.toLocaleString()}`;
  }
};

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2">
          {trip.destination}
        </h2>
        {trip.category && (
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md ml-2 whitespace-nowrap">
            {trip.category}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>⏱️</span>
          <span>{Array.isArray(trip.days) ? trip.days.length : trip.days || 1} Hari</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>💰</span>
          <span className="font-medium text-slate-900">
            {formatBudget(Number(trip.budget), trip.currency)}
          </span>
        </div>
      </div>

      <Link
        href={`/trips/${trip.id}`}
        className="mt-auto block text-center w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-sm font-medium rounded-lg transition-colors"
      >
        Lihat Detail &rarr;
      </Link>
    </div>
  );
}