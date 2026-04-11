"use client";

import Link from "next/link";
import {
  RiMapPin2Line,
  RiTimeLine,
  RiAuctionLine,
  RiHomeLine,
  RiRulerLine,
} from "react-icons/ri";
import { TRUST } from "@/constants";

function timeAgo(d) {
  const h = Math.floor((Date.now() - new Date(d)) / 36e5);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function PropertyCard({ property, className = "" }) {
  const trust = TRUST[property.trust] || TRUST.basic;
  const photo = property.photos?.find((p) => p?.url)?.url;

  return (
    <Link
      href={`/property/${property._id}`}
      className={`group block bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover ${className}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No photo</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-xl ${trust.badgeClass}`}
        >
          {trust.label}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl capitalize shadow-sm">
          {property.type}
        </span>
        {property.facing && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-xs rounded-lg">
            {property.facing} Facing
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-xl font-extrabold text-gray-900">
            {property.priceLabel}
          </span>
          {property.fields?.sft && (
            <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
              <RiRulerLine className="text-xs" />
              {property.fields.sft} sq.ft
            </div>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-800 mb-1.5 line-clamp-1">
          {property.title}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <RiMapPin2Line className="text-green-500 text-xs flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">
            {property.address?.area}, {property.address?.city}
          </span>
        </div>

        {(property.fields?.bhk || property.fields?.sqYards) && (
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            {property.fields?.bhk && (
              <div className="flex items-center gap-1">
                <RiHomeLine className="text-gray-400 text-xs" />
                {property.fields.bhk} BHK
              </div>
            )}
            {property.fields?.sqYards && (
              <div className="flex items-center gap-1">
                <RiRulerLine className="text-gray-400 text-xs" />
                {property.fields.sqYards} Sq.Yd
              </div>
            )}
          </div>
        )}

        {property.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <RiTimeLine className="text-xs" />
            {timeAgo(property.createdAt)}
            {property.bidCount > 0 && (
              <span className="ml-2 text-green-600 font-semibold">
                {property.bidCount} bid{property.bidCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Link
            href={`/property/${property._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <RiAuctionLine className="text-sm" /> Bid ₹99
          </Link>
        </div>
      </div>
    </Link>
  );
}
