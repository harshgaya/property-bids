'use client'

import { PROPERTY_TYPES, FACING, TAGS, TRUST } from '@/constants'
import { RiFilterLine, RiCloseLine } from 'react-icons/ri'

export default function PropertyFilters({ filters, onChange, onReset, compact = false }) {
  function toggle(key, value) {
    const cur = filters[key] || []
    onChange({ [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] })
  }

  return (
    <div className={compact ? 'flex flex-wrap gap-3 items-center' : 'space-y-6'}>

      {/* Property type */}
      <div>
        {!compact && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Property Type</p>}
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ type: value })}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                filters.type === value
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!compact && (
        <>
          {/* Budget */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Budget (₹ Lakhs)</p>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={filters.budMin || ''} onChange={e => onChange({ budMin: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
              <input type="number" placeholder="Max" value={filters.budMax || ''} onChange={e => onChange({ budMax: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
            </div>
          </div>

          {/* Area */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Area (Sq ft)</p>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={filters.sftMin || ''} onChange={e => onChange({ sftMin: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
              <input type="number" placeholder="Max" value={filters.sftMax || ''} onChange={e => onChange({ sftMax: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
            </div>
          </div>

          {/* Facing */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Facing</p>
            <div className="flex flex-wrap gap-1.5">
              {FACING.map(f => (
                <button key={f} onClick={() => toggle('facing', f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${filters.facing?.includes(f) ? 'bg-green-50 text-green-700 border-green-400' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Verification</p>
            <div className="space-y-2.5">
              {Object.entries(TRUST).map(([key, cfg]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={!!filters.trust?.includes(key)} onChange={() => toggle('trust', key)}
                    className="w-4 h-4 accent-green-600 rounded" />
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dotClass}`} />
                  <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => toggle('tags', tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${filters.tags?.includes(tag) ? 'bg-green-50 text-green-700 border-green-400' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button onClick={onReset} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium">
            <RiCloseLine /> Reset Filters
          </button>
        </>
      )}
    </div>
  )
}
