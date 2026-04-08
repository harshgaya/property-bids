"use client";

import { PROPERTY_TYPES, FACING, TAGS, TRUST } from "@/constants";
import { RiCloseLine } from "react-icons/ri";

export default function PropertyFilters({ filters, onChange, onReset }) {
  function toggle(key, value) {
    const cur = filters[key] || [];
    onChange({
      [key]: cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value],
    });
  }

  return (
    <div className="space-y-5">
      {/* Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Property Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ type: value })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                filters.type === value
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Budget (₹ Lakhs)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <label className="text-xs text-gray-400 mb-1 block">Min (₹L)</label>
            <input
              type="number"
              placeholder="20"
              value={filters.budMin || ""}
              onChange={(e) => onChange({ budMin: e.target.value })}
              className="w-full min-w-0 px-2 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="min-w-0">
            <label className="text-xs text-gray-400 mb-1 block">Max (₹L)</label>
            <input
              type="number"
              placeholder="500"
              value={filters.budMax || ""}
              onChange={(e) => onChange({ budMax: e.target.value })}
              className="w-full min-w-0 px-2 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 transition"
            />
          </div>
        </div>
        {filters.budMin &&
          filters.budMax &&
          parseFloat(filters.budMin) >= parseFloat(filters.budMax) && (
            <p className="text-xs text-red-500 mt-1">
              Min must be less than Max
            </p>
          )}
      </div>

      {/* Area */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Area (Sq ft)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <label className="text-xs text-gray-400 mb-1 block">
              Min (sft)
            </label>
            <input
              type="number"
              placeholder="500"
              value={filters.sftMin || ""}
              onChange={(e) => onChange({ sftMin: e.target.value })}
              className="w-full min-w-0 px-2 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="min-w-0">
            <label className="text-xs text-gray-400 mb-1 block">
              Max (sft)
            </label>
            <input
              type="number"
              placeholder="5000"
              value={filters.sftMax || ""}
              onChange={(e) => onChange({ sftMax: e.target.value })}
              className="w-full min-w-0 px-2 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Facing */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Facing
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FACING.map((f) => (
            <button
              key={f}
              onClick={() => toggle("facing", f)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                filters.facing?.includes(f)
                  ? "bg-green-50 text-green-700 border-green-400"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Verification
        </p>
        <div className="space-y-2.5">
          {Object.entries(TRUST).map(([key, cfg]) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={!!filters.trust?.includes(key)}
                onChange={() => toggle("trust", key)}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dotClass}`}
              />
              <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                {cfg.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggle("tags", tag)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                filters.tags?.includes(tag)
                  ? "bg-green-50 text-green-700 border-green-400"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {(filters.budMin ||
        filters.budMax ||
        filters.sftMin ||
        filters.sftMax ||
        filters.facing?.length > 0 ||
        filters.trust?.length > 0 ||
        filters.tags?.length > 0) && (
        <div className="pt-1">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
          >
            <RiCloseLine /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
