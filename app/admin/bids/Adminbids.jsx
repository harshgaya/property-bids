"use client";
import { useState, useEffect, useCallback } from "react";
import {
  AdminTable,
  AdminPagination,
  AdminPageHeader,
} from "@/components/admin/AdminTable";

function fmtPrice(n) {
  return n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(0)} L`;
}
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}

export default function AdminBids() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const q = new URLSearchParams({ page, ...(status && { status }) });
      const res = await fetch(`/api/admin/bids?${q}`);
      const json = await res.json();
      if (!cancelled) {
        if (json.success) {
          setData(json.data);
          setTotal(json.pagination.totalPages);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  const columns = [
    {
      key: "property",
      label: "Property",
      render: (r) => (
        <div>
          <p className="font-semibold text-gray-900 text-sm max-w-[180px] truncate">
            {r.propertyTitle}
          </p>
        </div>
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
      key: "amount",
      label: "Offer",
      render: (r) => (
        <span className="font-bold text-gray-900 text-sm">
          {fmtPrice(r.amount)}
        </span>
      ),
    },
    {
      key: "bidFee",
      label: "Fee",
      render: (r) => (
        <span className="text-xs text-gray-500">₹{r.bidFee || 99}</span>
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
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
            r.status === "accepted"
              ? "bg-green-50 text-green-700"
              : r.status === "rejected"
                ? "bg-red-50 text-red-700"
                : r.status === "withdrawn"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-yellow-50 text-yellow-700"
          }`}
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
      <AdminPageHeader title="Bids" sub="All bids placed on the platform" />

      <div className="mb-5">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white text-gray-700 focus:border-green-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMsg="No bids yet"
      />
      <AdminPagination
        page={page}
        totalPages={total}
        onPage={(p) => setPage(p)}
      />
    </div>
  );
}
