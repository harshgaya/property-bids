"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEyeLine,
  RiAuctionLine,
  RiMapPin2Line,
  RiCheckLine,
  RiTimeLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiShieldCheckLine,
  RiLockLine,
  RiRefreshLine,
  RiCloseLine,
} from "react-icons/ri";
import { TRUST, PLANS } from "@/constants";

function fmtPrice(n) {
  if (!n) return "—";
  return n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(0)} L`;
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── Unpaid listing banner ─────────────────────────────────────────────────────
function UnpaidBanner({ plan }) {
  const p = PLANS.find((pl) => pl.key === plan) || PLANS[0];
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl mt-3">
      <RiLockLine className="text-amber-500 flex-shrink-0 text-base" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-700">
          Payment pending — listing is hidden
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          Pay {p.priceLabel} for {p.name} to make it live
        </p>
      </div>
      <button className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors flex-shrink-0">
        Pay Now
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState("listings");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingBid, setAcceptingBid] = useState(null);
  const router = useRouter();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function rejectBid(bidId) {
    try {
      const res = await fetch(`/api/bids/${bidId}/reject`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function withdrawBid(bidId) {
    if (!confirm("Withdraw this bid? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/bids/${bidId}/withdraw`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function acceptBid(propertyId, bidId) {
    setAcceptingBid(bidId);
    try {
      const res = await fetch(`/api/bids/${bidId}/accept`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      await load(); // refresh
    } catch (e) {
      alert(e.message);
    } finally {
      setAcceptingBid(null);
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error)
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-xl"
          >
            <RiRefreshLine /> Retry
          </button>
        </div>
      </div>
    );

  const {
    listings = [],
    incomingBids = [],
    placedBids = [],
    stats = {},
  } = data || {};

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              My Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage your listings and bids
            </p>
          </div>
          <Link
            href="/post-property"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors self-start"
          >
            <RiAddLine /> Post New Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "My Listings",
              value: stats.listings || 0,
              icon: RiMapPin2Line,
              bg: "bg-green-50",
              ic: "text-green-600",
            },
            {
              label: "Incoming Bids",
              value: stats.incomingBids || 0,
              icon: RiAuctionLine,
              bg: "bg-blue-50",
              ic: "text-blue-600",
            },
            {
              label: "Total Views",
              value: stats.totalViews || 0,
              icon: RiEyeLine,
              bg: "bg-purple-50",
              ic: "text-purple-600",
            },
            {
              label: "Accepted Bids",
              value: stats.acceptedBids || 0,
              icon: RiCheckLine,
              bg: "bg-orange-50",
              ic: "text-orange-600",
            },
          ].map(({ label, value, icon: Icon, bg, ic }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-200 p-4"
            >
              <div
                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`${ic} text-base`} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
          {[
            { key: "listings", label: "My Listings" },
            {
              key: "incomingBids",
              label: `Incoming Bids${incomingBids.length > 0 ? ` (${incomingBids.length})` : ""}`,
            },
            {
              key: "placedBids",
              label: `My Bids${placedBids.length > 0 ? ` (${placedBids.length})` : ""}`,
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── My Listings ── */}
        {tab === "listings" && (
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <RiMapPin2Line className="text-gray-200 text-5xl mx-auto mb-3" />
                <p className="font-semibold text-gray-500 mb-1">
                  No listings yet
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  Post your first property and start receiving bids
                </p>
                <Link
                  href="/post-property"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  <RiAddLine /> Post First Property
                </Link>
              </div>
            ) : (
              listings.map((l) => {
                const trust = TRUST[l.trust] || TRUST.basic;
                return (
                  <div
                    key={l._id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300">
                        {l.photos?.[0]?.url && (
                          <img
                            src={l.photos[0].url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900 truncate">
                            {l.title}
                          </p>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${trust.badgeClass}`}
                          >
                            {trust.label}
                          </span>
                          {!l.isPaid && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                              Unpaid
                            </span>
                          )}
                          {l.isPaid && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                          <RiMapPin2Line className="text-xs" />
                          {l.address?.area}, {l.address?.city}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="font-bold text-gray-900">
                            {l.priceLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            <RiAuctionLine />
                            {l.bidCount || 0} bids
                          </span>
                          <span className="flex items-center gap-1">
                            <RiEyeLine />
                            {l.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <RiTimeLine />
                            {timeAgo(l.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          href={`/property/${l._id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <RiExternalLinkLine /> View
                        </Link>
                        <Link
                          href={`/post-property?edit=${l._id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                        >
                          <RiEdit2Line /> Edit
                        </Link>
                      </div>
                    </div>

                    {/* Unpaid — show payment prompt */}
                    {!l.isPaid && <UnpaidBanner plan={l.plan} />}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Incoming Bids ── */}
        {tab === "incomingBids" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {incomingBids.length === 0 ? (
              <div className="text-center py-20">
                <RiAuctionLine className="text-gray-200 text-5xl mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No bids yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Bids on your listings will appear here
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Bid Amount
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incomingBids.map((bid, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs truncate max-w-[160px]">
                          {bid.propertyTitle}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {timeAgo(bid.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="font-bold text-gray-900">
                          {fmtPrice(bid.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            bid.status === "accepted"
                              ? "bg-green-50 text-green-700"
                              : bid.status === "rejected"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {bid.status === "accepted"
                            ? "Accepted"
                            : bid.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {bid.status === "pending" && (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => acceptBid(bid.propertyId, bid._id)}
                              disabled={acceptingBid === bid._id}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              {acceptingBid === bid._id ? "..." : "Accept"}
                            </button>
                            <button
                              onClick={() => rejectBid(bid._id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── My Placed Bids ── */}
        {tab === "placedBids" && (
          <div className="space-y-3">
            {placedBids.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <RiAuctionLine className="text-gray-200 text-5xl mx-auto mb-3" />
                <p className="font-semibold text-gray-500">
                  No bids placed yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Browse properties and place bids
                </p>
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              placedBids.map((pb, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:border-green-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {pb.propertyTitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <RiMapPin2Line className="text-xs" />
                      {pb.city}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-gray-900 text-sm">
                      {fmtPrice(pb.bid?.amount)}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        pb.bid?.status === "accepted"
                          ? "bg-green-50 text-green-700"
                          : pb.bid?.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {pb.bid?.status || "pending"}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {pb.bid?.status === "pending" && (
                      <button
                        onClick={() => withdrawBid(pb.bid._id)}
                        className="px-3 py-2 text-xs border border-red-200 text-red-500 rounded-xl hover:bg-red-50 flex-shrink-0"
                      >
                        Withdraw
                      </button>
                    )}
                    <Link
                      href={`/property/${pb.propertyId}`}
                      className="flex items-center gap-1 px-3 py-2 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex-shrink-0"
                    >
                      <RiExternalLinkLine /> View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
