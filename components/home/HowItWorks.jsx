import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiHome4Line, RiShieldCheckLine, RiGroupLine, RiMoneyDollarCircleLine } from 'react-icons/ri'

const sellerSteps = [
  { n:'01', icon: RiHome4Line,          title: 'Post Your Property',    desc: 'Fill in details, add live camera photos with GPS stamp. Takes 10 minutes.' },
  { n:'02', icon: RiShieldCheckLine,    title: 'Get Verified',          desc: 'Our team or lawyer verifies location, docs, and ownership. Zero fakes.' },
  { n:'03', icon: RiGroupLine,          title: 'Receive Serious Bids',  desc: 'Buyers pay ₹99 to place a private bid. Only serious ones reach you.' },
  { n:'04', icon: RiMoneyDollarCircleLine, title: 'Accept & Close',     desc: 'Review bids privately, accept the best one, and close the deal directly.' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-3">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">From listing to closing — transparent, fast, and trust-first.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerSteps.map(({ n, icon: Icon, title, desc }, i) => (
            <AnimatedSection key={n} delay={i * 120} className="relative group">
              {/* Connector line */}
              {i < sellerSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 h-0.5 bg-gray-200 z-10" />
              )}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-md shadow-green-100 flex-shrink-0">
                    <Icon className="text-white text-xl" />
                  </div>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-green-100 transition-colors">{n}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
