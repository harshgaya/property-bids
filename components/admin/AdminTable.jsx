"use client";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

export function AdminTable({ columns, data, loading, emptyMsg = "No data" }) {
  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-5 py-4 border-b border-gray-50">
            {columns.map((_, j) => (
              <div
                key={j}
                className="h-4 bg-gray-200 animate-pulse rounded flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-gray-400 text-sm"
                >
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 whitespace-nowrap">
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-5">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 bg-white transition-colors"
      >
        <RiArrowLeftLine /> Prev
      </button>
      <span className="text-sm text-gray-500 px-4 py-2 bg-white border border-gray-200 rounded-xl">
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:border-green-500 hover:text-green-600 bg-white transition-colors"
      >
        Next <RiArrowRightLine />
      </button>
    </div>
  );
}

export function AdminPageHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
        {sub && <p className="text-gray-400 text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${value ? "left-4" : "left-0.5"}`}
        />
      </div>
      {label && <span className="text-xs text-gray-600">{label}</span>}
    </label>
  );
}
