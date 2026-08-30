"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrips, Trip } from "@/services/tripService";
import { TripCard } from "@/components/TripCard";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getTrips()
      .then((data) => setTrips(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTrips = trips.filter(
    (t) =>
      t.destination?.toLowerCase().includes(search.toLowerCase()) ||
      t.travel_style?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    const idA = Number(a.id) || 0;
    const idB = Number(b.id) || 0;
    const budgetA = Number(a.budget) || 0;
    const budgetB = Number(b.budget) || 0;

    if (sortBy === "oldest") return idA - idB;
    if (sortBy === "highest") return budgetB - budgetA;
    return idB - idA;
  });

  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage) || 1;
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat riwayat perjalanan...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Trip History</h1>
          <p className="text-gray-500 text-sm">{trips.length} saved itineraries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "highest")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Budget</option>
          </select>
        </div>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">No trips found</h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">Create your first itinerary to see it listed here.</p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Generate a Trip →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}