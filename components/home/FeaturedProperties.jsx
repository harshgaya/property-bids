import Link from 'next/link'
import { RiArrowRightLine } from 'react-icons/ri'
import PropertyCard from '@/components/ui/PropertyCard'

const SAMPLE = [
  { _id:'1', type:'villa',     title:'3 BHK Villa with Private Garden',   priceLabel:'₹85 L',    trust:'legal',  address:{area:'Jubilee Hills',  city:'Hyderabad'}, tags:['Gated','Corner'],    fields:{bhk:3,sft:2100}, createdAt: new Date(Date.now()-2*36e5).toISOString() },
  { _id:'2', type:'apartment', title:'2 BHK Apartment Near Metro',         priceLabel:'₹42 L',    trust:'manual', address:{area:'Madhapur',       city:'Hyderabad'}, tags:['Metro'],              fields:{bhk:2,sft:1100}, createdAt: new Date(Date.now()-4*36e5).toISOString() },
  { _id:'3', type:'highrise',  title:'3 BHK High-Rise with Pool Access',   priceLabel:'₹1.2 Cr',  trust:'legal',  address:{area:'Hitech City',    city:'Hyderabad'}, tags:['Gated','Main Road'],  fields:{bhk:3,sft:1850}, createdAt: new Date(Date.now()-6*36e5).toISOString() },
  { _id:'4', type:'plot',      title:'Residential Plot 200 Sq Yards',      priceLabel:'₹28 L',    trust:'manual', address:{area:'Kompally',       city:'Hyderabad'}, tags:['Corner'],             fields:{sqYards:200},    createdAt: new Date(Date.now()-8*36e5).toISOString() },
  { _id:'5', type:'house',     title:'Independent House 4BHK Main Road',   priceLabel:'₹65 L',    trust:'legal',  address:{area:'Banjara Hills',  city:'Hyderabad'}, tags:['Main Road'],          fields:{bhk:4,sft:2400}, createdAt: new Date(Date.now()-10*36e5).toISOString() },
  { _id:'6', type:'apartment', title:'2 BHK Apartment Near Infosys',       priceLabel:'₹38 L',    trust:'basic',  address:{area:'Kukatpally',     city:'Hyderabad'}, tags:['Metro'],              fields:{bhk:2,sft:980},  createdAt: new Date(Date.now()-12*36e5).toISOString() },
]

export default function FeaturedProperties() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Latest Listings</h2>
            <p className="text-gray-500">All GPS-verified. Real photos. Real locations.</p>
          </div>
          <Link href="/buy" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700">
            View all <RiArrowRightLine />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
      </div>
    </section>
  )
}
