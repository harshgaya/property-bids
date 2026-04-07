import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiStarFill, RiDoubleQuotesL } from 'react-icons/ri'

const reviews = [
  { name:'Suresh Reddy',    role:'Sold Villa in Jubilee Hills',    rating:5, text:'Got 4 serious bids in 3 days. No time wasters — every bidder was genuine. Sold at asking price.' },
  { name:'Priya Mehta',     role:'Bought Apartment in Madhapur',   rating:5, text:'The GPS verification gave me confidence. I knew exactly where the flat was before visiting. No surprises.' },
  { name:'Ravi Kumar',      role:'Sold Plot in Kompally',          rating:5, text:'The legal verification service is worth every rupee. My buyer had full confidence in the documents.' },
  { name:'Anitha Sharma',   role:'Bought House in Banjara Hills',  rating:5, text:'Map-first search is brilliant. I shortlisted 6 properties in my exact target area in 20 minutes.' },
  { name:'Kiran Rao',       role:'Sold Apartment in Hitech City',  rating:5, text:'₹99 bid filter is genius. Every person who bid was actually serious. Closed in 2 weeks.' },
  { name:'Deepak Nair',     role:'Invested in Land near ORR',      rating:5, text:'Finally a platform that shows real photos with GPS stamps. I knew the land was real before I paid for inspection.' },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="text-center mb-14">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">What People Say</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-3">Trusted by Buyers & Sellers</h2>
          <p className="text-gray-500 text-lg">Real people. Real deals. Real trust.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full card-hover">
                <RiDoubleQuotesL className="text-green-200 text-3xl mb-3" />
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, j) => <RiStarFill key={j} className="text-yellow-400 text-sm" />)}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
