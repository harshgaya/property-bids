import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiCheckLine, RiShieldCheckLine } from 'react-icons/ri'
import { PLANS, BID_PRICE } from '@/constants'

export default function ListingPlans() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="text-center mb-14">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Listing Plans</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-3">List Your Property</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Higher verification = more trust = more serious buyers.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PLANS.map((plan, i) => (
            <AnimatedSection key={plan.key} delay={i * 100}
              className={`relative bg-white rounded-2xl p-7 flex flex-col border transition-all ${plan.highlight ? 'border-green-500 shadow-2xl shadow-green-100 ring-2 ring-green-500' : 'border-gray-200 hover:shadow-lg hover:border-gray-300'}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-5 py-1.5 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">MOST POPULAR</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${plan.dotClass}`} />
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">{plan.name}</span>
              </div>
              <div className="mb-5">
                <span className="text-5xl font-black text-gray-900">{plan.priceLabel}</span>
                <span className="text-gray-400 text-sm ml-2">one time</span>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <RiCheckLine className="text-green-500 mt-0.5 flex-shrink-0 text-base" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/post-property" className={`w-full py-3.5 text-sm font-bold rounded-2xl text-center transition-all ${plan.highlight ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {plan.cta}
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 max-w-lg mx-auto">
          <RiShieldCheckLine className="text-green-600 text-2xl mx-auto mb-2" />
          <p className="text-gray-800 font-semibold">Buyers pay <span className="text-green-600 font-black">₹{BID_PRICE} per bid</span> — only serious buyers reach you.</p>
          <p className="text-sm text-gray-500 mt-1">All bids are private. Only you see who bid on your property.</p>
        </AnimatedSection>
      </div>
    </section>
  )
}
