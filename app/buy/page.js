'use client'

import { useState } from 'react'
import { RiSearchLine, RiFilterLine, RiMapPin2Line, RiGridLine } from 'react-icons/ri'
import PropertyCard    from '@/components/property/PropertyCard'
import PropertyFilters from '@/components/property/PropertyFilters'
import { useProperties } from '@/hooks/useProperties'


export default function BuyPage() {
  const { properties, loading, error, pagination, filters, update, reset, page, setPage } = useProperties()
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="pt-16 min-h-screen bg-gray-50">

      {/* Search header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">

            {/* Search input */}
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 max-w-sm">
              <RiSearchLine className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, area, locality..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                value={filters.city}
                onChange={e => update({ city: e.target.value })}
              />
            </div>

            {/* Type tabs — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1 overflow-x-auto">
              {['all','villa','apartment','highrise','house','plot','land'].map(t => (
                <button key={t} onClick={() => update({ type: t })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${filters.type === t ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all flex-shrink-0 ${showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'}`}>
              <RiFilterLine /> <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* Sidebar filters — desktop */}
          <aside className={`flex-shrink-0 w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-32">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-900 flex items-center gap-2"><RiFilterLine className="text-green-600" />Filters</p>
                <button onClick={reset} className="text-xs text-red-400 hover:text-red-600 font-medium">Reset</button>
              </div>
              <PropertyFilters filters={filters} onChange={update} onReset={reset} />
            </div>
          </aside>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
              <div className="bg-white w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto anim-scale-in">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold text-gray-900">Filters</p>
                  <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">✕</button>
                </div>
                <PropertyFilters filters={filters} onChange={update} onReset={reset} />
                <button onClick={() => setShowFilters(false)} className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-xl">
                  Show {pagination.total || 0} Results
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">

            {/* Count + sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : <><strong className="text-gray-900">{pagination.total || 0}</strong> properties found</>}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RiGridLine /> Latest first
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="h-48 skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 skeleton rounded w-2/3" />
                      <div className="h-4 skeleton rounded w-full" />
                      <div className="h-4 skeleton rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-500 mb-3 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="px-5 py-2 bg-green-600 text-white text-sm rounded-xl">Retry</button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && properties.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                <RiMapPin2Line className="text-gray-200 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 font-semibold text-lg">No properties match your filters</p>
                <p className="text-gray-400 text-sm mt-1 mb-5">Try broadening your search criteria</p>
                <button onClick={reset} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 transition-colors bg-white">
                  ← Previous
                </button>
                <span className="text-sm text-gray-500 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
                  {page} / {pagination.totalPages}
                </span>
                <button disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}
                  className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 transition-colors bg-white">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
