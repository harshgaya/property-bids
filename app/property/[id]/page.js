import Link        from 'next/link'
import { RiMapPin2Line, RiShieldCheckLine, RiAuctionLine, RiArrowLeftLine, RiHome4Line, RiRulerLine, RiCompassLine, RiCheckLine } from 'react-icons/ri'
import { TRUST }   from '@/constants'

// Sample static data — replace with DB fetch
function getProperty(id) {
  return {
    _id: id,
    type: 'villa',
    title: '3 BHK Villa with Private Garden & Pool',
    description: 'A beautifully designed 3 BHK villa in the heart of Jubilee Hills. Spacious rooms, private garden, swimming pool, and covered parking. East-facing, Vastu-compliant.',
    priceLabel: '₹85 L',
    price: 8500000,
    trust: 'legal',
    facing: 'East',
    tags: ['Gated', 'Corner', 'Main Road'],
    address: { area: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', full: 'Road No. 12, Jubilee Hills, Hyderabad — 500033' },
    fields: { bhk: 3, sft: 2100, sqYards: 233, uds: 180, floors: 2, lift: false },
    photos: [null, null, null, null],
    createdAt: new Date(Date.now() - 2 * 36e5),
  }
}

export default function PropertyPage({ params }) {
  const p     = getProperty(params.id)
  const trust = TRUST[p.trust] || TRUST.basic

  const details = [
    { label:'Type',      value: p.type.charAt(0).toUpperCase() + p.type.slice(1), icon: RiHome4Line },
    { label:'BHK',       value: p.fields.bhk ? `${p.fields.bhk} BHK` : '—',      icon: RiHome4Line },
    { label:'Built-up',  value: p.fields.sft ? `${p.fields.sft} sq.ft` : '—',    icon: RiRulerLine },
    { label:'Sq Yards',  value: p.fields.sqYards ? `${p.fields.sqYards} sq.yd` : '—', icon: RiRulerLine },
    { label:'Facing',    value: p.facing || '—',                                  icon: RiCompassLine },
    { label:'Floors',    value: p.fields.floors || '—',                           icon: RiHome4Line },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <Link href="/buy" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
          <RiArrowLeftLine /> Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-7">

          {/* Left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Photos */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 h-64 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl relative overflow-hidden">
                <span className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-xl ${trust.badgeClass}`}>
                  <RiShieldCheckLine className="inline mr-1" />{trust.label}
                </span>
              </div>
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gradient-to-br from-gray-300 to-gray-200 rounded-xl" />
              ))}
            </div>

            {/* Title + price */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900">{p.title}</h1>
                <span className="text-3xl font-black text-green-600">{p.priceLabel}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <RiMapPin2Line className="text-green-500 text-sm" />
                <span className="text-sm text-gray-500">{p.address.full}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl">{t}</span>
                ))}
              </div>
            </div>

            {/* Details grid */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-extrabold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {details.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="font-bold text-gray-900 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-extrabold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
            </div>

            {/* Trust proof */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiShieldCheckLine className="text-green-600 text-lg" />
                <h3 className="font-bold text-gray-900">Trust Verification</h3>
              </div>
              {['GPS location validated within 50 metres','Live camera photos taken on-site','All photos GPS-stamped with timestamp','Lawyer verified documents (Legal plan)'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <RiCheckLine className="text-green-500 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <p className="text-3xl font-black text-gray-900 mb-1">{p.priceLabel}</p>
              <p className="text-xs text-gray-400 mb-5">Asking price · Negotiable</p>

              <button className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors shadow-md shadow-green-100 text-sm mb-3">
                <RiAuctionLine className="text-base" /> Place Bid — ₹99
              </button>

              <p className="text-xs text-gray-400 text-center mb-5">Bid fee is non-refundable. Only the owner sees your bid.</p>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                {[
                  ['Type',      p.type],
                  ['BHK',       p.fields.bhk ? `${p.fields.bhk} BHK` : '—'],
                  ['Area',      p.fields.sft ? `${p.fields.sft} sq.ft` : '—'],
                  ['Facing',    p.facing],
                  ['Location',  p.address.city],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{k}</span>
                    <span className="font-semibold text-gray-900 capitalize">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
