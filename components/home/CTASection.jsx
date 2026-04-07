import Link from 'next/link'
import { RiAddLine, RiMapPin2Line } from 'react-icons/ri'

export default function CTASection() {
  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Ready to list your property?</h2>
        <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of verified sellers. Get serious buyers with real intent — every bid costs ₹99.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/post-property" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 text-sm font-bold rounded-xl hover:bg-green-50 transition-colors">
            Post Property <RiAddLine className="text-base" />
          </Link>
          <Link href="/map" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
            <RiMapPin2Line className="text-base" /> Explore Map
          </Link>
        </div>
      </div>
    </section>
  )
}
