import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link           from 'next/link'
import { RiHome4Line, RiShieldCheckLine, RiAuctionLine, RiShakeHandsLine, RiCheckLine, RiMapPin2Line, RiCameraLine, RiFileShieldLine, RiArrowRightLine } from 'react-icons/ri'

export const metadata = { title: 'How It Works' }

const sellerFlow = [
  { icon: RiHome4Line,      n:'01', title:'Post Your Property',    desc:'Fill in property details, set your asking price, and choose your verification plan.' },
  { icon: RiMapPin2Line,    n:'02', title:'Pin Exact Location',    desc:'Drop a pin on the map. The system validates your GPS matches the pin within 100 metres.' },
  { icon: RiCameraLine,     n:'03', title:'Upload Live Photos',    desc:'Take photos using your camera — gallery uploads alone are blocked. Each photo is GPS-stamped.' },
  { icon: RiShieldCheckLine,n:'04', title:'Get Verified',          desc:'Our team (or lawyer for Legal plan) checks your documents, ownership, and location.' },
  { icon: RiAuctionLine,    n:'05', title:'Receive Paid Bids',     desc:'Serious buyers pay ₹99 to place a private bid. You see all bids in your dashboard.' },
  { icon: RiShakeHandsLine,  n:'06', title:'Accept & Close',        desc:'Accept the bid you like. Connect directly with the buyer. No agent fees.' },
]

const buyerFlow = [
  { icon: RiMapPin2Line,    n:'01', title:'Search on Map',         desc:'Browse verified properties on the map. Filter by type, budget, area, and facing.' },
  { icon: RiShieldCheckLine,n:'02', title:'Check Verification',    desc:'See trust level — Basic, Pre-Verified, or Legal. All photos are GPS-stamped.' },
  { icon: RiFileShieldLine, n:'03', title:'Review Details',        desc:'Full property details, live camera photos, and legal documents (Legal plan).' },
  { icon: RiAuctionLine,    n:'04', title:'Pay ₹99 to Bid',        desc:'Pay a small bid fee to show serious intent. Private — only the owner sees your bid.' },
  { icon: RiShakeHandsLine,  n:'05', title:'Owner Accepts',         desc:'If the owner accepts, you connect directly. No middlemen, no commission.' },
]

const trustDetails = [
  { title:'GPS Validation',      desc:'When a seller submits, we match their device GPS to the pin they dropped. Mismatch = blocked.' },
  { title:'Live Camera Only',    desc:'Photos must be taken in-app. Gallery uploads are blocked. Each photo carries GPS + timestamp metadata.' },
  { title:'Admin Review',        desc:'Every listing passes admin review before going live. Suspicious listings are flagged and removed.' },
  { title:'Paid Bids = Intent',  desc:'₹99 bid fee filters out tyre-kickers. Only serious buyers who want to transact will pay to bid.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader dark badge="Transparent Process" title="How PropertyBids Works" subtitle="A trust-first process from listing to closing. No fakes. No spam. Just real deals." />

      {/* Seller flow */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-14">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">For Sellers</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-2">How to Sell Your Property</h2>
            <p className="text-gray-500 max-w-lg">From listing to closing — takes less than 10 minutes to post.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sellerFlow.map(({ icon: Icon, n, title, desc }, i) => (
              <AnimatedSection key={n} delay={i * 80}>
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-green-100">
                      <Icon className="text-white text-lg" />
                    </div>
                    <span className="text-3xl font-black text-gray-100">{n}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8 text-center">
            <Link href="/post-property" className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors">
              Post Your Property <RiArrowRightLine />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Buyer flow */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-14">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">For Buyers</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-2">How to Buy a Property</h2>
            <p className="text-gray-500 max-w-lg">Search, verify, bid — no spam calls, no fake listings.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {buyerFlow.map(({ icon: Icon, n, title, desc }, i) => (
              <AnimatedSection key={n} delay={i * 80}>
                <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-green-200 hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white text-lg" />
                    </div>
                    <span className="text-3xl font-black text-gray-100">{n}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8 text-center">
            <Link href="/buy" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
              Search Properties <RiArrowRightLine />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust system */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Trust System</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">How We Prevent Fake Listings</h2>
            <p className="text-gray-500">Multiple layers of validation make faking technically impossible.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trustDetails.map(({ title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <div className="flex gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <RiCheckLine className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
