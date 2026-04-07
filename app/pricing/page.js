import Link          from 'next/link'
import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiCheckLine, RiCloseLine, RiShieldCheckLine, RiAuctionLine } from 'react-icons/ri'
import { PLANS, BID_PRICE } from '@/constants'

const compare = [
  { feature:'List on map',             basic:true,  manual:true,  legal:true  },
  { feature:'GPS pin validation',      basic:true,  manual:true,  legal:true  },
  { feature:'Photos allowed',          basic:'10',  manual:'30',  legal:'30'  },
  { feature:'Live camera required',    basic:'5',   manual:'10',  legal:'10'  },
  { feature:'Owner ID check',          basic:false, manual:true,  legal:true  },
  { feature:'Facing & road check',     basic:false, manual:true,  legal:true  },
  { feature:'Document verification',   basic:false, manual:false, legal:true  },
  { feature:'Lawyer reviewed',         basic:false, manual:false, legal:true  },
  { feature:'Priority in search',      basic:false, manual:true,  legal:true  },
  { feature:'Featured placement',      basic:false, manual:false, legal:true  },
]

function Cell({ val }) {
  if (val === true)  return <RiCheckLine className="text-green-500 text-lg mx-auto" />
  if (val === false) return <RiCloseLine className="text-gray-300 text-lg mx-auto" />
  return <span className="text-sm font-semibold text-gray-700">{val}</span>
}

export const metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <>
      <PageHeader badge="Transparent Pricing" title="Simple, One-Time Pricing" subtitle="No subscriptions. No hidden fees. Pay once per listing." />

      {/* Plan cards */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {PLANS.map((plan, i) => (
              <AnimatedSection key={plan.key} delay={i * 100}>
                <div className={`relative rounded-2xl p-7 flex flex-col border h-full transition-all ${plan.highlight ? 'border-green-500 shadow-2xl shadow-green-100 ring-2 ring-green-500' : 'border-gray-200 hover:shadow-lg'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-5 py-1.5 bg-green-600 text-white text-xs font-bold rounded-full shadow">MOST POPULAR</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${plan.dotClass}`} />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">{plan.name}</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-gray-900">{plan.priceLabel}</span>
                    <span className="text-gray-400 text-sm ml-2">one time</span>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <RiCheckLine className="text-green-500 mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/post-property" className={`text-center py-3.5 rounded-2xl text-sm font-bold transition-all ${plan.highlight ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bid pricing */}
          <AnimatedSection>
            <div className="bg-gray-900 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                <RiAuctionLine className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-white mb-1">Buyer Bid Fee — ₹{BID_PRICE}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Buyers pay ₹{BID_PRICE} per bid. This filters out time wasters — only serious buyers who intend to transact will pay. All bids are private. Only you see who bid on your property.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Full Feature Comparison</h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-4 text-gray-500 font-semibold w-1/2">Feature</th>
                    {PLANS.map(p => (
                      <th key={p.key} className={`px-4 py-4 text-center font-bold text-sm ${p.highlight ? 'text-green-600 bg-green-50' : 'text-gray-700'}`}>
                        <div className="flex flex-col items-center gap-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${p.dotClass}`} />
                          {p.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compare.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-3.5 text-gray-700 font-medium">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center"><Cell val={row.basic} /></td>
                      <td className="px-4 py-3.5 text-center bg-green-50/30"><Cell val={row.manual} /></td>
                      <td className="px-4 py-3.5 text-center"><Cell val={row.legal} /></td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-5 py-4 font-bold text-gray-900">Price</td>
                    {PLANS.map(p => (
                      <td key={p.key} className={`px-4 py-4 text-center font-black text-gray-900 ${p.highlight ? 'bg-green-50/50' : ''}`}>{p.priceLabel}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
