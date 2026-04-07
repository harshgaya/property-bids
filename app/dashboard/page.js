'use client'

import { useState } from 'react'
import { RiAddLine, RiEyeLine, RiAuctionLine, RiMapPin2Line, RiCheckLine, RiTimeLine, RiMoneyDollarCircleLine } from 'react-icons/ri'
import Link from 'next/link'
import { TRUST } from '@/constants'

const MOCK_LISTINGS = [
  { _id:'1', title:'3 BHK Villa — Jubilee Hills', priceLabel:'₹85 L', trust:'legal',  type:'villa',     address:{area:'Jubilee Hills',city:'Hyderabad'}, bids:4, views:128, createdAt:new Date(Date.now()-5*864e5) },
  { _id:'2', title:'2 BHK Apartment — Madhapur',  priceLabel:'₹42 L', trust:'manual', type:'apartment', address:{area:'Madhapur',     city:'Hyderabad'}, bids:2, views:74,  createdAt:new Date(Date.now()-10*864e5) },
]

const MOCK_BIDS = [
  { propertyTitle:'3 BHK Villa — Jubilee Hills', bidder:'Buyer ••••', amount:9900000, status:'pending',  time:'2h ago' },
  { propertyTitle:'3 BHK Villa — Jubilee Hills', bidder:'Buyer ••••', amount:8800000, status:'pending',  time:'5h ago' },
  { propertyTitle:'2 BHK Apartment — Madhapur',  bidder:'Buyer ••••', amount:4000000, status:'accepted', time:'1d ago' },
]

function fmtPrice(n) { return n >= 10000000 ? `₹${(n/10000000).toFixed(2)} Cr` : `₹${(n/100000).toFixed(0)} L` }

export default function DashboardPage() {
  const [tab, setTab] = useState('listings')

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your listings and incoming bids</p>
          </div>
          <Link href="/post-property" className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors self-start">
            <RiAddLine /> Post New Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Active Listings', value:MOCK_LISTINGS.length, icon:RiMapPin2Line, color:'green' },
            { label:'Total Bids',      value:MOCK_BIDS.length,     icon:RiAuctionLine, color:'blue' },
            { label:'Total Views',     value:'202',                icon:RiEyeLine,     color:'purple' },
            { label:'Accepted Bids',   value:'1',                  icon:RiCheckLine,   color:'orange' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
                <Icon className={`text-${color}-600 text-base`} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {['listings','bids'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'listings' ? 'My Listings' : 'Incoming Bids'}
            </button>
          ))}
        </div>

        {/* Listings tab */}
        {tab === 'listings' && (
          <div className="space-y-4">
            {MOCK_LISTINGS.map(l => {
              const trust = TRUST[l.trust] || TRUST.basic
              return (
                <div key={l._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-green-200 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 truncate">{l.title}</p>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${trust.badgeClass}`}>{trust.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><RiMapPin2Line className="text-xs" />{l.address.area}, {l.address.city}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="font-bold text-gray-900">{l.priceLabel}</span>
                      <span className="flex items-center gap-1"><RiAuctionLine />{l.bids} bids</span>
                      <span className="flex items-center gap-1"><RiEyeLine />{l.views} views</span>
                      <span className="flex items-center gap-1 capitalize"><RiTimeLine />{l.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/property/${l._id}`} className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">View</Link>
                    <Link href={`/post-property?edit=${l._id}`} className="px-3 py-2 text-xs font-medium bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">Edit</Link>
                  </div>
                </div>
              )
            })}
            {MOCK_LISTINGS.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <RiMapPin2Line className="text-gray-200 text-5xl mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No listings yet</p>
                <Link href="/post-property" className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
                  <RiAddLine /> Post First Property
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Bids tab */}
        {tab === 'bids' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Bid Amount</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BIDS.map((bid, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-xs truncate max-w-[160px]">{bid.propertyTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><RiTimeLine className="text-xs" />{bid.time}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="font-bold text-gray-900">{fmtPrice(bid.amount)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${bid.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {bid.status === 'accepted' ? 'Accepted' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {bid.status === 'pending' && (
                        <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
