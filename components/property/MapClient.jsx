'use client'

import { useState } from 'react'
import { RiMapPin2Line, RiFilterLine, RiListCheck, RiSearchLine } from 'react-icons/ri'
import PropertyCard from '@/components/property/PropertyCard'
import { TRUST, PROPERTY_TYPES } from '@/constants'

const PINS = [
  { id:'1', top:'22%', left:'28%', price:'₹85 L',   trust:'legal',  type:'villa',     title:'3 BHK Villa',       address:{area:'Jubilee Hills',city:'Hyderabad'}, tags:['Gated'],    fields:{bhk:3,sft:2100}, facing:'East', createdAt:new Date(Date.now()-2*36e5) },
  { id:'2', top:'38%', left:'55%', price:'₹42 L',   trust:'manual', type:'apartment', title:'2 BHK Apartment',   address:{area:'Madhapur',     city:'Hyderabad'}, tags:['Metro'],    fields:{bhk:2,sft:1100}, facing:'West', createdAt:new Date(Date.now()-4*36e5) },
  { id:'3', top:'18%', left:'65%', price:'₹1.2 Cr', trust:'legal',  type:'highrise',  title:'3 BHK High-Rise',   address:{area:'Hitech City',  city:'Hyderabad'}, tags:['Gated'],    fields:{bhk:3,sft:1850}, facing:'North',createdAt:new Date(Date.now()-6*36e5) },
  { id:'4', top:'55%', left:'35%', price:'₹28 L',   trust:'manual', type:'plot',      title:'Plot 200 SqYd',     address:{area:'Kompally',     city:'Hyderabad'}, tags:['Corner'],   fields:{sqYards:200},    facing:'East', createdAt:new Date(Date.now()-8*36e5) },
  { id:'5', top:'62%', left:'68%', price:'₹65 L',   trust:'legal',  type:'house',     title:'Ind. House 4BHK',   address:{area:'Banjara Hills',city:'Hyderabad'}, tags:['Main Road'],fields:{bhk:4,sft:2400}, facing:'South',createdAt:new Date(Date.now()-10*36e5) },
  { id:'6', top:'45%', left:'18%', price:'₹38 L',   trust:'basic',  type:'apartment', title:'2 BHK Apartment',   address:{area:'Kukatpally',   city:'Hyderabad'}, tags:['Metro'],    fields:{bhk:2,sft:980},  facing:'West', createdAt:new Date(Date.now()-12*36e5) },
]

export default function MapClient() {
  const [selected,   setSelected]   = useState(null)
  const [activeType, setActiveType] = useState('all')
  const [view,       setView]       = useState('map') // map | list

  const filtered = PINS.filter(p => activeType === 'all' || p.type === activeType)
  const dot      = (t) => TRUST[t]?.dotClass || 'bg-gray-400'

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">

      {/* Controls bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-xs">
          <RiSearchLine className="text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search area or city..." className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button key={value} onClick={() => setActiveType(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all border ${activeType === value ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <button onClick={() => setView('map')}  className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${view === 'map'  ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><RiMapPin2Line /></button>
          <button onClick={() => setView('list')} className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${view === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><RiListCheck /></button>
        </div>
      </div>

      {view === 'map' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Map area */}
          <div className="flex-1 relative bg-green-50 overflow-hidden">
            {/* Road grid */}
            {[[20,'h'],[40,'h'],[60,'h'],[78,'h'],[22,'v'],[45,'v'],[68,'v']].map(([p, d], i) => (
              <div key={i} className={`absolute ${d==='h' ? 'left-0 right-0 h-2' : 'top-0 bottom-0 w-2'} bg-white/80`} style={d==='h' ? {top:`${p}%`} : {left:`${p}%`}} />
            ))}
            {/* Blocks */}
            {[[3,3,16,15],[24,3,18,15],[46,3,20,15],[70,3,26,15],[3,24,16,13],[24,22,18,16],[46,22,20,14],[70,22,26,15],[3,44,16,13],[24,43,18,14],[46,44,20,13],[70,44,26,13],[3,64,16,14],[24,63,18,15],[46,65,20,13],[70,63,26,14]].map(([l,t,w,h],i) => (
              <div key={i} className="absolute bg-green-100 rounded-sm opacity-80" style={{left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}%`}} />
            ))}

            {/* Pins */}
            {filtered.map(pin => (
              <div key={pin.id} className="absolute" style={{top: pin.top, left: pin.left, transform:'translate(-50%,-100%)', zIndex: selected?.id === pin.id ? 30 : 10 }}>
                <button onClick={() => setSelected(selected?.id === pin.id ? null : pin)} className="group flex flex-col items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg transition-all border-2 ${selected?.id === pin.id ? 'bg-green-600 text-white border-green-600 scale-110' : 'bg-white text-gray-900 border-white hover:border-green-400 hover:scale-105'}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot(pin.trust)}`} />
                    {pin.price}
                  </div>
                  <div className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent mt-0 ${selected?.id === pin.id ? 'border-t-green-600' : 'border-t-white'}`}
                    style={{borderTopWidth:'6px'}} />
                </button>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-2xl border border-gray-200 shadow-md p-3 space-y-2">
              {Object.entries(TRUST).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${v.dotClass}`} />
                  {v.label}
                </div>
              ))}
            </div>

            {/* Result count */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-2 text-xs font-semibold text-gray-700">
              <strong className="text-green-600">{filtered.length}</strong> properties
            </div>

            {/* Selected card popup */}
            {selected && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 z-40 anim-scale-in">
                <PropertyCard property={{...selected, _id: selected.id, priceLabel: selected.price}} />
              </div>
            )}
          </div>

          {/* Right list panel — desktop */}
          <div className="hidden lg:flex flex-col w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">{filtered.length} properties in view</p>
              <p className="text-xs text-gray-400 mt-0.5">Click a pin or card to highlight</p>
            </div>
            <div className="p-3 space-y-3">
              {filtered.map(pin => (
                <button key={pin.id} onClick={() => setSelected(selected?.id === pin.id ? null : pin)} className="w-full text-left">
                  <PropertyCard property={{...pin, _id: pin.id, priceLabel: pin.price}} className={selected?.id === pin.id ? 'ring-2 ring-green-500' : ''} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(pin => (
              <PropertyCard key={pin.id} property={{...pin, _id: pin.id, priceLabel: pin.price}} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
