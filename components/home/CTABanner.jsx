import Link from 'next/link'
import { RiAddLine, RiMapPin2Line, RiArrowRightLine } from 'react-icons/ri'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function CTABanner() {
  return (
    <section className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-300 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-200 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to list your property?<br />
            <span className="text-green-400">Serious buyers are waiting.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Every bid costs ₹99. No time wasters. No agents. Just direct, verified buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-property" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-800 text-sm font-bold rounded-2xl hover:bg-green-50 transition-all shadow-xl">
              Post Property <RiAddLine className="text-base" />
            </Link>
            <Link href="/buy" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white text-sm font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
              Browse Listings <RiArrowRightLine className="text-base" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
