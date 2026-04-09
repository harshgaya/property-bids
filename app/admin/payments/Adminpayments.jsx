"use client";
import { useState, useEffect, useCallback } from "react";
import {
  AdminTable,
  AdminPagination,
  AdminPageHeader,
} from "@/components/admin/AdminTable";
import { PLANS } from "@/constants";

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}

export default function AdminPayments() {
  const [tab, setTab] = useState("listing");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const q = new URLSearchParams({ type: tab, page });
      const res = await fetch(`/api/admin/payments?${q}`);
      const json = await res.json();
      if (!cancelled) {
        if (json.success) {
          setData(json.data);
          setTotal(json.pagination.totalPages);
          setRevenue(json.totalRevenue || 0);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [tab, page]);

  const listingCols = [
    {
      key: "title",
      label: "Property",
      render: (r) => (
        <div>
          <p className="font-semibold text-gray-900 text-sm max-w-[200px] truncate">
            {r.title}
          </p>
          <p className="text-xs text-gray-400">{r.address?.city}</p>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (r) => {
        const p = PLANS.find((pl) => pl.key === r.plan);
        return (
          <span className="text-xs font-semibold text-gray-700">
            {p?.name || r.plan}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (r) => {
        const p = PLANS.find((pl) => pl.key === r.plan);
        return (
          <span className="font-bold text-gray-900 text-sm">
            {p?.priceLabel || "—"}
          </span>
        );
      },
    },
    {
      key: "razorpayPaymentId",
      label: "Payment ID",
      render: (r) => (
        <span className="font-mono text-xs text-gray-400">
          {r.razorpayPaymentId || "Manual"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => (
        <span className="text-xs text-gray-400">{fmtDate(r.createdAt)}</span>
      ),
    },
  ];

  const bidCols = [
    {
      key: "property",
      label: "Property",
      render: (r) => (
        <p className="font-semibold text-gray-900 text-sm max-w-[180px] truncate">
          {r.propertyTitle}
        </p>
      ),
    },
    {
      key: "bidderPhone",
      label: "Bidder",
      render: (r) => (
        <span className="font-mono text-xs text-gray-600">{r.bidderPhone}</span>
      ),
    },
    {
      key: "bidFee",
      label: "Bid Fee",
      render: (r) => (
        <span className="font-bold text-gray-900">₹{r.bidFee || 99}</span>
      ),
    },
    {
      key: "razorpayPaymentId",
      label: "Payment ID",
      render: (r) => (
        <span className="font-mono text-xs text-gray-400 max-w-[120px] truncate block">
          {r.razorpayPaymentId || "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${r.status === "accepted" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => (
        <span className="text-xs text-gray-400">{fmtDate(r.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader title="Payments" sub="Revenue tracking" />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5">
        {[
          { key: "listing", label: "Listing Fees" },
          { key: "bid", label: "Bid Fees" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Revenue stat */}
      {tab === "bid" && revenue > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 inline-flex items-center gap-3">
          <div>
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
              Total Bid Fee Revenue
            </p>
            <p className="text-2xl font-black text-green-700">
              ₹{revenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      <AdminTable
        columns={tab === "listing" ? listingCols : bidCols}
        data={data}
        loading={loading}
        emptyMsg="No payments yet"
      />
      <AdminPagination
        page={page}
        totalPages={total}
        onPage={(p) => setPage(p)}
      />
    </div>
  );
}
