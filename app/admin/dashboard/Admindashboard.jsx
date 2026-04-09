"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiBuilding2Line,
  RiUserLine,
  RiAuctionLine,
  RiShieldCheckLine,
  RiArrowUpLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TRUST } from "@/constants";

function fmtPrice(n) {
  if (!n) return "—";
  return n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(0)} L`;
}

function timeAgo(d) {
  const h = Math.floor((Date.now() - new Date(d)) / 36e5);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StatCard({ label, value, sub, icon: Icon, iconBg, iconColor, alert }) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 ${alert ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`text-base ${iconColor}`} />
        </div>
        {sub && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
            <RiArrowUpLine className="text-xs" />
            {sub} this week
          </span>
        )}
      </div>
      <p
        className={`text-3xl font-black ${alert ? "text-amber-700" : "text-gray-900"}`}
      >
        {value}
      </p>
      <p
        className={`text-xs mt-0.5 ${alert ? "text-amber-600" : "text-gray-400"}`}
      >
        {label}
      </p>
    </div>
  );
}

function MiniDonut({ data }) {
  const COLORS = [
    "#16a34a",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];
  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-gray-600 capitalize">
              {d._id || "other"}
            </span>
            <span className="text-xs font-bold text-gray-900 ml-auto">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListingsBarChart({ data }) {
  const formatted = data.map((d) => ({ ...d, date: d._id?.slice(5) }));
  return (
    <ResponsiveContainer width="100%" height={128}>
      <BarChart
        data={formatted}
        margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
      >
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "#f0fdf4" }}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />
        <Bar
          dataKey="count"
          name="Listings"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-2xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  const {
    stats = {},
    recentListings = [],
    recentBids = [],
    byType = [],
    byDay = [],
  } = data || {};

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Overview of PropertyBids platform
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Properties"
          value={stats.totalProperties || 0}
          sub={stats.newPropertiesWeek}
          icon={RiBuilding2Line}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers || 0}
          sub={stats.newUsersWeek}
          icon={RiUserLine}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Total Bids"
          value={stats.totalBids || 0}
          icon={RiAuctionLine}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          sub={
            stats.totalBids > 0
              ? `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")} revenue`
              : null
          }
        />
        <StatCard
          label="Pending Verification"
          value={stats.pendingVerification || 0}
          icon={RiShieldCheckLine}
          iconBg={stats.pendingVerification > 0 ? "bg-amber-100" : "bg-gray-50"}
          iconColor={
            stats.pendingVerification > 0 ? "text-amber-600" : "text-gray-400"
          }
          alert={stats.pendingVerification > 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            Listings by Type
          </h3>
          {byType.length > 0 ? (
            <MiniDonut data={byType} />
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            New Listings — Last 7 Days
          </h3>
          {byDay.length > 0 ? (
            <ListingsBarChart data={byDay} />
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent listings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Listings</h3>
            <Link
              href="/admin/properties"
              className="text-xs text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
            >
              View all <RiExternalLinkLine />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentListings.length === 0 ? (
              <p className="text-gray-400 text-sm p-5">No listings yet</p>
            ) : (
              recentListings.map((l) => {
                const trust = TRUST[l.trust] || TRUST.basic;
                return (
                  <div
                    key={l._id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {l.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {l.address?.city} · {timeAgo(l.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-lg flex-shrink-0 ${trust.badgeClass}`}
                    >
                      {trust.label}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${l.isPaid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {l.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent bids */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Bids</h3>
            <Link
              href="/admin/bids"
              className="text-xs text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
            >
              View all <RiExternalLinkLine />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBids.length === 0 ? (
              <p className="text-gray-400 text-sm p-5">No bids yet</p>
            ) : (
              recentBids.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {b.propertyTitle}
                    </p>
                    <p className="text-xs text-gray-400">
                      {b.bidderPhone} · {timeAgo(b.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-black text-gray-900 flex-shrink-0">
                    {fmtPrice(b.amount)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${
                      b.status === "accepted"
                        ? "bg-green-50 text-green-700"
                        : b.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
