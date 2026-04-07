import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link           from 'next/link'
import { SITE, STATS } from '@/constants'
import { RiShieldCheckLine, RiMapPin2Line, RiGroupLine, RiHeartLine } from 'react-icons/ri'

const values = [
  { icon: RiShieldCheckLine, title:'Trust First',      desc:'Every feature we build starts with the question: does this prevent fake listings and protect buyers?' },
  { icon: RiMapPin2Line,     title:'Location Honest',  desc:'We built GPS validation before we built anything else. A listing without a real location is worthless.' },
  { icon: RiGroupLine,       title:'Seller Respect',   desc:'Sellers deserve serious buyers. The ₹99 bid fee is our commitment to their time.' },
  { icon: RiHeartLine,       title:'Built for India',  desc:'Designed for Indian real estate realities — UDS, LRS, road access, facing — not a western platform clone.' },
]

const team = [
  { name:'Arjun Reddy',    role:'Founder & CEO',          initials:'AR', color:'bg-green-100 text-green-700' },
  { name:'Priya Sharma',   role:'Head of Trust & Ops',    initials:'PS', color:'bg-blue-100 text-blue-700' },
  { name:'Kiran Rao',      role:'Lead Engineer',           initials:'KR', color:'bg-purple-100 text-purple-700' },
  { name:'Anitha Nair',    role:'Head of Legal Verify',   initials:'AN', color:'bg-orange-100 text-orange-700' },
]

export const metadata = { title: 'About Us' }

export default function AboutPage() {
  return (
    <>
      <PageHeader dark badge="Our Story" title="Built Because Fakes Are Exhausting" subtitle={`${SITE.name} was founded to solve one problem: fake property listings waste everyone's time and destroy trust.`} />

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Our Mission</span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-5">Make fake listings technically impossible</h2>
                <p className="text-gray-500 leading-relaxed mb-4">We built GPS validation, live-camera-only photo uploads, and paid bids not as features — but as foundations. Without them, the platform doesn't work.</p>
                <p className="text-gray-500 leading-relaxed">Every listing on {SITE.name} has a real GPS location, real live photos taken at that location, and is reviewed by a human before going live. That's the promise.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s, i) => (
                  <div key={i} className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
                    <p className="text-3xl font-black text-green-600 mb-1">{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">What We Believe</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full hover:border-green-200 hover:shadow-md transition-all">
                  <div className="w-11 h-11 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="text-green-600 text-lg" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">The Team</h2>
            <p className="text-gray-500">Small team. Huge mission.</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <AnimatedSection key={m.name} delay={i * 80} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${m.color} flex items-center justify-center text-lg font-bold mx-auto mb-3`}>{m.initials}</div>
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">Join the trust revolution</h2>
          <p className="text-green-100 mb-8">List your property or find your next home — verified, transparent, and real.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-property" className="px-7 py-3.5 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition-colors">Post Property</Link>
            <Link href="/buy"           className="px-7 py-3.5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors">Search Listings</Link>
          </div>
        </div>
      </section>
    </>
  )
}
