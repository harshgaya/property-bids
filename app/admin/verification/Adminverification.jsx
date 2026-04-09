"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiShieldCheckLine,
  RiCloseLine,
  RiMapPin2Line,
  RiFilePdfLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import { TRUST, PLANS } from "@/constants";
import { AdminPageHeader } from "@/components/admin/AdminTable";

export default function AdminVerification() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await fetch(
        "/api/admin/properties?trust=manual,legal&limit=50",
      );
      const json = await res.json();
      if (!cancelled) {
        setItems(json.success ? json.data.filter((p) => !p.isVerified) : []);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function verify(id) {
    await fetch("/api/admin/properties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isVerified: true, isPaid: true }),
    });
    load();
  }

  async function reject(id) {
    await fetch("/api/admin/properties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: false }),
    });
    load();
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Verification Queue"
        sub={`${items.length} properties awaiting verification`}
      />

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-2xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <RiShieldCheckLine className="text-gray-200 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">All caught up!</p>
          <p className="text-gray-400 text-sm mt-1">
            No properties pending verification
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((p) => {
            const plan = PLANS.find((pl) => pl.key === p.plan);
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div
                  className={`px-5 py-3 flex items-center justify-between border-b border-gray-100 ${p.plan === "legal" ? "bg-green-50" : "bg-blue-50"}`}
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <RiMapPin2Line className="text-xs" />
                      {p.address?.area}, {p.address?.city}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl flex-shrink-0 ml-3 ${p.plan === "legal" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {plan?.name || p.plan} · {plan?.priceLabel}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  {/* Details */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-gray-400">Type</p>
                      <p className="font-semibold text-gray-900 capitalize mt-0.5">
                        {p.type}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-gray-400">Price</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {p.priceLabel}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-gray-400">GPS</p>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {p.location ? "✓ Pinned" : "✗ Missing"}
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  {p.documents?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">
                        Documents ({p.documents.length})
                      </p>
                      <div className="space-y-1.5">
                        {p.documents.map((doc, i) => (
                          <a
                            key={i}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors"
                          >
                            <RiFilePdfLine className="text-red-500 text-sm flex-shrink-0" />
                            <span className="text-xs text-gray-700 flex-1 truncate">
                              {doc.name}
                            </span>
                            <RiExternalLinkLine className="text-gray-400 text-xs flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/property/${p._id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                      <RiExternalLinkLine /> View Listing
                    </Link>
                    <button
                      onClick={() => reject(p._id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <RiCloseLine /> Reject
                    </button>
                    <button
                      onClick={() => verify(p._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-colors"
                    >
                      <RiShieldCheckLine /> Mark Verified
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
