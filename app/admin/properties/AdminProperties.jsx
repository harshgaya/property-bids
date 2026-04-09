"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RiSearchLine, RiExternalLinkLine } from "react-icons/ri";
import { TRUST } from "@/constants";
import {
  AdminTable,
  AdminPagination,
  AdminPageHeader,
  Toggle,
} from "@/components/admin/AdminTable";

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-IN") : "—";
}

export default function AdminProperties() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [trust, setTrust] = useState("");
  const [paid, setPaid] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const q = new URLSearchParams({
        page,
        ...(search && { search }),
        ...(trust && { trust }),
        ...(paid && { paid }),
      });
      const res = await fetch(`/api/admin/properties?${q}`);
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
  }, [page, search, trust, paid]);

  async function patch(id, update) {
    await fetch("/api/admin/properties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...update }),
    });
    load();
  }

  const columns = [
    {
      key: "title",
      label: "Property",
      render: (r) => (
        <div>
          <p className="font-semibold text-gray-900 max-w-[200px] truncate">
            {r.title}
          </p>
          <p className="text-xs text-gray-400">
            {r.address?.area}, {r.address?.city}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (r) => (
        <span className="text-xs capitalize text-gray-600">{r.type}</span>
      ),
    },
    {
      key: "trust",
      label: "Trust",
      render: (r) => {
        const t = TRUST[r.trust] || TRUST.basic;
        return (
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${t.badgeClass}`}
          >
            {t.label}
          </span>
        );
      },
    },
    {
      key: "trust_change",
      label: "Change Trust",
      render: (r) => (
        <select
          value={r.trust}
          onChange={(e) => patch(r._id, { trust: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-green-500"
        >
          <option value="basic">Basic</option>
          <option value="manual">Manual</option>
          <option value="legal">Legal</option>
        </select>
      ),
    },
    {
      key: "isPaid",
      label: "Paid",
      render: (r) => (
        <Toggle
          value={!!r.isPaid}
          onChange={(v) => patch(r._id, { isPaid: v })}
        />
      ),
    },
    {
      key: "isVerified",
      label: "Verified",
      render: (r) => (
        <Toggle
          value={!!r.isVerified}
          onChange={(v) => patch(r._id, { isVerified: v })}
        />
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (r) => (
        <Toggle
          value={!!r.isActive}
          onChange={(v) => patch(r._id, { isActive: v })}
        />
      ),
    },
    {
      key: "bidCount",
      label: "Bids",
      render: (r) => (
        <span className="text-xs font-semibold text-gray-700">
          {r.bidCount || 0}
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
    {
      key: "view",
      label: "",
      render: (r) => (
        <Link
          href={`/property/${r._id}`}
          target="_blank"
          className="text-green-600 hover:text-green-700"
        >
          <RiExternalLinkLine />
        </Link>
      ),
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Properties"
        sub={`All listings on the platform`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <RiSearchLine className="text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search title or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="text-sm outline-none bg-transparent flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={trust}
          onChange={(e) => {
            setTrust(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white text-gray-700 focus:border-green-500"
        >
          <option value="">All Trust Levels</option>
          <option value="basic">Basic</option>
          <option value="manual">Manual Verified</option>
          <option value="legal">Legal Verified</option>
        </select>
        <select
          value={paid}
          onChange={(e) => {
            setPaid(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white text-gray-700 focus:border-green-500"
        >
          <option value="">All Payments</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMsg="No properties found"
      />
      <AdminPagination
        page={page}
        totalPages={total}
        onPage={(p) => setPage(p)}
      />
    </div>
  );
}
