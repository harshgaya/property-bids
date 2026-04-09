"use client";
import { useState, useEffect, useCallback } from "react";
import { RiSearchLine } from "react-icons/ri";
import {
  AdminTable,
  AdminPagination,
  AdminPageHeader,
  Toggle,
} from "@/components/admin/AdminTable";

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}

export default function AdminUsers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const q = new URLSearchParams({ page, ...(search && { search }) });
      const res = await fetch(`/api/admin/users?${q}`);
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
  }, [page, search]);

  async function toggleBan(id, isBanned) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isBanned }),
    });
    load();
  }

  const columns = [
    {
      key: "phone",
      label: "Phone",
      render: (r) => (
        <span className="font-mono text-sm text-gray-800">{r.phone}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (r) => (
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${r.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-600"}`}
        >
          {r.role || "user"}
        </span>
      ),
    },
    {
      key: "listingCount",
      label: "Listings",
      render: (r) => (
        <span className="text-sm font-semibold text-gray-700">
          {r.listingCount}
        </span>
      ),
    },
    {
      key: "bidCount",
      label: "Bids",
      render: (r) => (
        <span className="text-sm font-semibold text-gray-700">
          {r.bidCount}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (r) => (
        <span className="text-xs text-gray-400">{fmtDate(r.createdAt)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${r.isBanned ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {r.isBanned ? "Banned" : "Active"}
        </span>
      ),
    },
    {
      key: "ban",
      label: "Ban",
      render: (r) =>
        r.role !== "admin" && (
          <Toggle value={!!r.isBanned} onChange={(v) => toggleBan(r._id, v)} />
        ),
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader title="Users" sub="All registered users" />

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 max-w-xs mb-5">
        <RiSearchLine className="text-gray-400 flex-shrink-0" />
        <input
          placeholder="Search by phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-sm outline-none bg-transparent flex-1 text-gray-700 placeholder-gray-400"
        />
      </div>

      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMsg="No users found"
      />
      <AdminPagination
        page={page}
        totalPages={total}
        onPage={(p) => setPage(p)}
      />
    </div>
  );
}
