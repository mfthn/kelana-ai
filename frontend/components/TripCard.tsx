import Link from "next/link";
import { Trip } from "@/services/tripService";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  // Format angka budget menjadi USD 2,000
  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(trip.budget).replace("$", "USD ");

  // Badge warna untuk Kategori Anggaran
  const categoryColors = {
    Backpacker: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Standard: "bg-blue-100 text-blue-800 border-blue-200",
    Luxury: "bg-purple-100 text-purple-800 border-purple-200",
  };

  // Badge warna untuk Gaya Perjalanan
  const styleColors = {
    Family: "bg-amber-100 text-amber-800 border-amber-200",
    Solo: "bg-teal-100 text-teal-800 border-teal-200",
    Couple: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <h3 className="text-xl font-bold text-gray-800">{trip.destination}</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${categoryColors[trip.category] || "bg-gray-100"}`}>
            {trip.category}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${styleColors[trip.travel_style] || "bg-gray-100"}`}>
            {trip.travel_style}
          </span>
          <span className="text-xs px-2 py-0.5 rounded border bg-gray-50 text-gray-600">
            {trip.days} Hari
          </span>
        </div>

        <p className="text-lg font-bold text-gray-900 mb-4">{formattedBudget}</p>
      </div>

      <Link
        href={`/trips/${trip.id}`}
        className="inline-flex items-center justify-center w-full py-2 px-4 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-800 transition-colors"
      >
        View Details →
      </Link>
    </div>
  );
}