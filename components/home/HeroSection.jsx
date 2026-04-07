import Link from 'next/link'
import { RiShieldCheckLine, RiCameraLine, RiFileShieldLine, RiMapPin2Line, RiAddLine } from 'react-icons/ri'

const trustPillars = [
  { icon: RiMapPin2Line,    title: 'GPS Verified',   desc: 'Every location is real' },
  { icon: RiCameraLine,     title: 'Live Photos',    desc: 'See it as it is, live' },
  { icon: RiFileShieldLine, title: 'Legal Verified', desc: 'Documents checked' },
]

const floatingCards = [
  { title: '2 BHK Apartment', location: 'Hinjewadi, Pune',       price: '₹68 L' },
  { title: '4 BHK Villa',     location: 'Kondapur, Hyderabad',    price: '₹2.10 Cr' },
  { title: 'Residential Plot',location: 'Devanahalli, Bengaluru', price: '₹45 L' },
]

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-600 rounded-full mb-6">
              <RiShieldCheckLine className="text-green-600 text-sm" />
              <span className="text-xs font-semibold text-green-700 tracking-widest uppercase">Verified. Transparent. Trusted.</span>
            </div>

            <h1 className="text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-4">
              Direct Sellers.<br />Real Buyers.<br />
              <span className="text-green-600">No Fakes.</span><br />
              Price-Filtered.
            </h1>

            <p className="text-lg text-gray-500 mb-8">Only serious deals. No time waste.</p>

            <div className="flex flex-wrap gap-6 mb-10">
              {trustPillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/post-property" className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm">
                Post Property <RiAddLine className="text-base" />
              </Link>
              <Link href="/map" className="inline-flex items-center gap-2 px-6 py-3.5 text-green-700 text-sm font-semibold hover:text-green-800 transition-colors">
                <RiMapPin2Line className="text-base" /> Explore Map
              </Link>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72">

              {/* Phone */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-gray-200 z-10">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  <div className="h-7 bg-gray-900 flex items-center justify-center rounded-t-[2rem]">
                    <div className="w-20 h-4 bg-black rounded-full" />
                  </div>

                  {/* Map simulation */}
                  <div className="relative h-52 bg-green-50">
                    <div className="absolute top-1/3 left-0 right-0 h-2 bg-white opacity-60" />
                    <div className="absolute top-2/3 left-0 right-0 h-1 bg-white opacity-40" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-white opacity-60" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-white opacity-40" />
                    <div className="absolute top-[8%] left-[5%] w-[22%] h-[20%] bg-green-100 rounded" />
                    <div className="absolute top-[8%] left-[38%] w-[22%] h-[20%] bg-green-100 rounded" />
                    <div className="absolute top-[45%] left-[5%] w-[20%] h-[20%] bg-green-100 rounded" />
                    <div className="absolute top-[45%] left-[40%] w-[22%] h-[20%] bg-green-100 rounded" />

                    {[{top:'22%',left:'28%'},{top:'38%',left:'58%'},{top:'55%',left:'42%'},{top:'20%',left:'68%'}].map((pos, i) => (
                      <div key={i} className="absolute" style={pos}>
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    ))}

                    <div className="absolute top-3 left-3 right-3">
                      <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm border border-gray-100">
                        <RiMapPin2Line className="text-gray-400 text-sm" />
                        <span className="text-xs text-gray-400">Search location...</span>
                      </div>
                    </div>
                  </div>

                  {/* Featured card inside phone */}
                  <div className="p-3">
                    <div className="h-24 bg-gradient-to-br from-gray-600 to-gray-400 rounded-xl mb-2.5 relative">
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">VERIFIED</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">3 BHK Independent House</p>
                    <div className="flex items-center gap-1 mt-0.5 mb-1">
                      <RiMapPin2Line className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-400">Whitefield, Bengaluru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">₹1.25 Cr</span>
                      <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 font-medium rounded-full">Price-Filtered</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">1,850 sq.ft · 3 Beds · 3 Baths · 6h ago</p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-6 -right-4 lg:-right-10 flex flex-col gap-2 z-20">
                {floatingCards.map((c, i) => (
                  <div key={i} className="w-44 bg-white rounded-xl shadow-lg border border-gray-100 flex gap-2.5 items-center p-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 truncate">{c.location}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs font-bold text-gray-900">{c.price}</span>
                        <span className="text-xs px-1 py-0.5 bg-green-50 text-green-700 rounded font-medium">Price-Filtered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
