import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import {
  RiMapPin2Line,
  RiShieldCheckLine,
  RiArrowLeftLine,
  RiHome4Line,
  RiRulerLine,
  RiCompassLine,
  RiCheckLine,
} from "react-icons/ri";
import { getCollection } from "@/lib/mongodb";
import { TRUST } from "@/constants";
import BidButton from "./BidButton";
import PropertyGallery from "@/components/property/property-gallery";

async function getProperty(id) {
  try {
    const col = await getCollection("properties");
    return await col.findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}

export default async function PropertyPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const p = await getProperty(params.id);
  if (!p) notFound();

  const trust = TRUST[p.trust] || TRUST.basic;
  const photos = (p.photos || []).filter((ph) => ph?.url);

  const details = [
    {
      label: "Type",
      value: p.type?.charAt(0).toUpperCase() + p.type?.slice(1),
    },
    { label: "BHK", value: p.fields?.bhk ? `${p.fields.bhk} BHK` : null },
    {
      label: "Built-up",
      value: p.fields?.sft ? `${p.fields.sft} sq.ft` : null,
    },
    {
      label: "Sq Yards",
      value: p.fields?.sqYards ? `${p.fields.sqYards} sq.yd` : null,
    },
    { label: "Facing", value: p.facing || null },
    { label: "Floors", value: p.fields?.floors || null },
  ].filter((d) => d.value);

  const addressFull = [
    p.address?.area,
    p.address?.city,
    p.address?.state,
    p.address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6"
        >
          <RiArrowLeftLine /> Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-5">
            {/* Gallery — client component handles lightbox */}
            <PropertyGallery photos={photos} trust={trust} />

            {/* Title + price */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {p.title}
                </h1>
                <span className="text-3xl font-black text-green-600">
                  {p.priceLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <RiMapPin2Line className="text-green-500 text-sm flex-shrink-0" />
                <span className="text-sm text-gray-500">{addressFull}</span>
              </div>
              {p.location?.coordinates && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.location.coordinates[1]},${p.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors mb-2"
                >
                  <RiMapPin2Line className="text-base" />
                  Get Directions — Open in Google Maps
                </a>
              )}
              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            {details.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-extrabold text-gray-900 mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {details.map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="font-bold text-gray-900 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {p.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-extrabold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            )}

            {/* Documents */}
            {p.documents?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-extrabold text-gray-900 mb-3">Documents</h2>
                <div className="space-y-2">
                  {p.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors"
                    >
                      <span className="text-red-500 text-lg">📄</span>
                      <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                        {doc.name}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        View
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiShieldCheckLine className="text-green-600 text-lg" />
                <h3 className="font-bold text-gray-900">Trust Verification</h3>
              </div>
              {[
                "GPS location validated within 50 metres",
                "Live camera photos taken on-site",
                "All photos GPS-stamped with timestamp",
                p.trust === "legal"
                  ? "Lawyer verified documents"
                  : "Document upload pending verification",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600 mt-2"
                >
                  <RiCheckLine className="text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <p className="text-3xl font-black text-gray-900 mb-1">
                {p.priceLabel}
              </p>
              <p className="text-xs text-gray-400 mb-5">
                Asking price · Negotiable
              </p>
              <BidButton
                property={{
                  _id: p._id.toString(),
                  ownerId: p.ownerId,
                  title: p.title,
                  priceLabel: p.priceLabel,
                  price: p.price,
                  trust: p.trust,
                  isActive: p.isActive,
                  isPaid: p.isPaid,
                  address: p.address,
                  bidStatus: p.bidStatus || null,
                }}
              />
              <p className="text-xs text-gray-400 text-center mb-5">
                Bid fee is non-refundable. Only the owner sees your bid.
              </p>
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                {[
                  ["Type", p.type],
                  ["BHK", p.fields?.bhk ? `${p.fields.bhk} BHK` : null],
                  ["Area", p.fields?.sft ? `${p.fields.sft} sq.ft` : null],
                  ["Facing", p.facing],
                  ["Location", p.address?.city],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{k}</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {v}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs text-gray-400">
                  Listed{" "}
                  {new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {p.bidCount || 0} bids so far
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
