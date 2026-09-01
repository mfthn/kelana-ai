import Link from "next/link";
import { Trip } from "@/services/tripService";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string | number) => void;
}

const formatBudget = (amount: number, currency?: string) => {
  const num = Number(amount) || 0;
  const curr = currency?.toUpperCase() || "IDR";

  try {
    return new Intl.NumberFormat(curr === "IDR" ? "id-ID" : "en-US", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${curr} ${num.toLocaleString()}`;
  }
};

export function TripCard({ trip, onDelete }: TripCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
      {/* Tombol Hapus (Pojok Kanan Atas) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(trip.id);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus Rencana"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      )}

      <div className="flex justify-between items-start mb-4 pr-8">
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