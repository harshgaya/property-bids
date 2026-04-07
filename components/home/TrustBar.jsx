import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiGroupLine, RiShieldCheckLine, RiTimeLine, RiMapPin2Line } from 'react-icons/ri'

const pillars = [
  { icon: RiGroupLine,       title: 'Serious Buyers Only', desc: 'Verified & price-filtered — every bidder pays ₹99' },
  { icon: RiShieldCheckLine, title: 'Zero Fake Listings',  desc: 'GPS + live camera validation on every property' },
  { icon: RiMapPin2Line,     title: 'Map-First Search',    desc: 'Find properties by exact location on the map' },
  { icon: RiTimeLine,        title: 'Save Time',           desc: 'No agents. No callbacks. Only real opportunities' },
]

export default function TrustBar() {
  return (
    <section className="bg-green-50 border-y border-green-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <AnimatedSection key={title} delay={i * 100} className="flex items-start gap-3">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border border-green-100">
                <Icon className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
