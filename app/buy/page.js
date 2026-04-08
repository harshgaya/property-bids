"use client";

import { useState } from "react";
import {
  RiSearchLine,
  RiFilterLine,
  RiMapPin2Line,
  RiGridLine,
  RiCloseLine,
  RiEqualizerLine,
} from "react-icons/ri";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";

export default function BuyPage() {
  const {
    properties,
    loading,
    error,
    pagination,
    filters,
    update,
    reset,
    page,
    setPage,
  } = useProperties();
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.type && filters.type !== "all",
    filters.budMin,
    filters.budMax,
    filters.sftMin,
    filters.sftMax,
    filters.facing?.length > 0,
    filters.trust?.length > 0,
    filters.tags?.length > 0,
    filters.city,
  ].filter(Boolean).length;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Sticky search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 w-56 flex-shrink-0">
              <RiSearchLine className="text-gray-400 flex-shrink-0 text-sm" />
              <input
                type="text"
                placeholder="City or area..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0"
                value={filters.city}
                onChange={(e) => update({ city: e.target.value })}
              />
              {filters.city && (
                <button
                  onClick={() => update({ city: "" })}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <RiCloseLine className="text-sm" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all flex-shrink-0 ${showFilters ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200 hover:border-green-400"}`}
            >
              <RiEqualizerLine />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center ${showFilters ? "bg-white text-green-600" : "bg-green-600 text-white"}`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside
            className={`flex-shrink-0 w-60 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-32 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <RiFilterLine className="text-green-600" />
                  Filters
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={reset}
                    className="text-xs text-red-400 hover:text-red-600 font-medium"
                  >
                    Reset all
                  </button>
                )}
              </div>
              <PropertyFilters
                filters={filters}
                onChange={update}
                onReset={reset}
              />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="bg-white w-full rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold text-gray-900">Filters</p>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600"
                  >
                    <RiCloseLine />
                  </button>
                </div>
                <PropertyFilters
                  filters={filters}
                  onChange={update}
                  onReset={reset}
                />
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-5 py-3 bg-green-600 text-white font-bold rounded-xl text-sm"
                >
                  Show {pagination.total || 0} Results
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    <strong className="text-gray-900">
                      {pagination.total || 0}
                    </strong>{" "}
                    properties found
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <RiGridLine /> Latest first
              </p>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-red-500 mb-3 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 bg-green-600 text-white text-sm rounded-xl font-semibold"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && properties.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                <RiMapPin2Line className="text-gray-200 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 font-semibold text-lg mb-1">
                  No properties found
                </p>
                <p className="text-gray-400 text-sm mb-5">
                  Try broadening your search
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 transition-colors bg-white disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === pagination.totalPages ||
                        Math.abs(n - page) <= 1,
                    )
                    .reduce((acc, n, i, arr) => {
                      if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) =>
                      n === "..." ? (
                        <span
                          key={`e${i}`}
                          className="px-2 text-gray-400 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${n === page ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-green-400"}`}
                        >
                          {n}
                        </button>
                      ),
                    )}
                </div>

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 transition-colors bg-white disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
