"use client"

import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PropertyCard from '@/components/property/PropertyCard'
import { RiArrowRightLine } from 'react-icons/ri'

const SAMPLES = [
  { _id:'1', type:'villa',     title:'3 BHK Villa — Private Garden & Pool',  priceLabel:'₹85 L',   trust:'legal',  facing:'East',  address:{area:'Jubilee Hills', city:'Hyderabad'}, tags:['Gated','Corner'],   fields:{bhk:3,sft:2100}, createdAt:new Date(Date.now()-2*36e5) },
  { _id:'2', type:'apartment', title:'2 BHK Apartment Near Metro Station',    priceLabel:'₹42 L',   trust:'manual', facing:'West',  address:{area:'Madhapur',      city:'Hyderabad'}, tags:['Metro'],            fields:{bhk:2,sft:1100}, createdAt:new Date(Date.now()-4*36e5) },
  { _id:'3', type:'highrise',  title:'3 BHK High-Rise with Infinity Pool',    priceLabel:'₹1.2 Cr', trust:'legal',  facing:'North', address:{area:'Hitech City',   city:'Hyderabad'}, tags:['Gated','Main Road'],fields:{bhk:3,sft:1850}, createdAt:new Date(Date.now()-5*36e5) },
  { _id:'4', type:'plot',      title:'Residential Plot — 200 Sq Yards',       priceLabel:'₹28 L',   trust:'manual', facing:'East',  address:{area:'Kompally',      city:'Hyderabad'}, tags:['Corner'],           fields:{sqYards:200},    createdAt:new Date(Date.now()-7*36e5) },
  { _id:'5', type:'house',     title:'Independent House 4BHK — Main Road',    priceLabel:'₹65 L',   trust:'legal',  facing:'South', address:{area:'Banjara Hills', city:'Hyderabad'}, tags:['Main Road'],        fields:{bhk:4,sft:2400}, createdAt:new Date(Date.now()-9*36e5) },
  { _id:'6', type:'apartment', title:'2 BHK Apartment — Near Infosys Campus', priceLabel:'₹38 L',   trust:'basic',  facing:'West',  address:{area:'Kukatpally',    city:'Hyderabad'}, tags:['Metro'],            fields:{bhk:2,sft:980},  createdAt:new Date(Date.now()-11*36e5) },
]

export default function FeaturedListings() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Fresh Listings</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-2">Latest Properties</h2>
            <p className="text-gray-500">All GPS-verified. Real photos. No fake listings — ever.</p>
          </div>
          <Link href="/buy" className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex-shrink-0">
            View all listings <RiArrowRightLine />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLES.map((p, i) => (
            <AnimatedSection key={p._id} delay={i * 80}>
              <PropertyCard property={p} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
