import Link from 'next/link'
import PageHeader from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiCheckLine, RiAddLine, RiShieldCheckLine, RiMoneyDollarCircleLine, RiGroupLine, RiMapPin2Line } from 'react-icons/ri'
import { PLANS, STATS } from '@/constants'

const whySell = [
  { icon: RiGroupLine,             title: 'Serious Buyers Only',    desc: 'Every buyer pays ₹99 to bid. No tyre-kickers, no time wasters, no fake inquiries.' },
  { icon: RiShieldCheckLine,       title: 'Verified Trust Levels',  desc: 'Choose Basic, Manual, or Legal verification. Higher trust = more buyer confidence.' },
  { icon: RiMapPin2Line,           title: 'Map-First Discovery',    desc: 'Your listing shows up on the map where buyers are actively searching by location.' },
  { icon: RiMoneyDollarCircleLine, title: 'Direct Deal — No Agent', desc: 'Connect directly with buyers. No commission. No middlemen. You keep what you earn.' },
]

export default function SellPage() {
  return (
    <>
      <PageHeader dark badge="For Sellers" title="Sell Smarter. Not Harder." subtitle="List your property with GPS verification and live photos. Get serious bids from real buyers — not spam calls." />

      {/* Why sell */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Why Sellers Choose PropertyBids</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No agents. No fake leads. Just verified buyers with real intent.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySell.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all h-full">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="text-green-600 text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <p className="text-4xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-green-200 text-sm">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Choose Your Plan</h2>
            <p className="text-gray-500">Higher verification = more buyer trust = faster sale</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <AnimatedSection key={plan.key} delay={i * 100}>
                <div className={`rounded-2xl p-6 border h-full flex flex-col ${plan.highlight ? 'border-green-500 shadow-xl ring-2 ring-green-500 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-3 h-3 rounded-full ${plan.dotClass}`} />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">{plan.name}</span>
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-4">{plan.priceLabel}</p>
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <RiCheckLine className="text-green-500 mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/post-property" className={`text-center py-3 rounded-xl text-sm font-bold transition-colors ${plan.highlight ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'}`}>
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to post your property?</h2>
          <p className="text-gray-500 mb-8">Takes less than 10 minutes. Start getting bids today.</p>
          <Link href="/post-property" className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
            Post Property Now <RiAddLine />
          </Link>
        </div>
      </section>
    </>
  )
}
