import Link from 'next/link'
import { RiMapPin2Line, RiTimeLine, RiAuctionLine } from 'react-icons/ri'
import { TRUST_CONFIG } from '@/constants'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 36e5)
  const d = Math.floor(diff / 864e5)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export default function PropertyCard({ property }) {
  const trust = TRUST_CONFIG[property.trust] || TRUST_CONFIG.basic

  return (
    <Link href={`/property/${property._id}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-200">

      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <RiMapPin2Line className="text-gray-400 text-3xl" />
        </div>
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${trust.badgeClass}`}>
          {trust.label}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-white text-gray-700 rounded-full shadow-sm capitalize">
          {property.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xl font-extrabold text-gray-900">{property.priceLabel}</span>
          {property.fields?.sft && <span className="text-xs text-gray-400">{property.fields.sft} sq.ft</span>}
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1 truncate">{property.title}</p>
        <div className="flex items-center gap-1 mb-3">
          <RiMapPin2Line className="text-gray-400 text-xs flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">{property.address?.area}, {property.address?.city}</span>
        </div>
        {property.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <RiTimeLine className="text-xs" />
            {timeAgo(property.createdAt)}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
            <RiAuctionLine className="text-sm" /> Bid ₹99
          </button>
        </div>
      </div>
    </Link>
  )
}
