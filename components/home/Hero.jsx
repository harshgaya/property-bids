import Link from "next/link";
import {
  RiShieldCheckLine,
  RiCameraLine,
  RiFileShieldLine,
  RiMapPin2Line,
  RiAddLine,
  RiArrowRightLine,
  RiStarFill,
} from "react-icons/ri";
import { STATS } from "@/constants";

const trustPillars = [
  {
    icon: RiMapPin2Line,
    title: "GPS Verified",
    desc: "Every location is real",
  },
  { icon: RiCameraLine, title: "Live Photos", desc: "See it as it is, live" },
  {
    icon: RiFileShieldLine,
    title: "Legal Verified",
    desc: "Documents checked",
  },
];

const floatingCards = [
  {
    title: "3 BHK Villa",
    location: "Jubilee Hills, Hyd",
    price: "₹85 L",
    trust: "Legal",
    delay: "anim-float",
    bg: "bg-green-50",
  },
  {
    title: "2 BHK Apartment",
    location: "Hinjewadi, Pune",
    price: "₹42 L",
    trust: "Pre-Verified",
    delay: "",
    bg: "bg-white",
  },
  {
    title: "Residential Plot",
    location: "Devanahalli, Blr",
    price: "₹28 L",
    trust: "Pre-Verified",
    delay: "",
    bg: "bg-white",
  },
];

export default function Hero() {
  return (
    <section className="relative pt-16 min-h-screen hero-gradient overflow-hidden flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Copy ── */}
          <div>
            {/* Trust pill */}
            <div className="anim-fade-up inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
              <RiShieldCheckLine className="text-green-400 text-sm" />
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
                Verified · Transparent · Trusted
              </span>
            </div>

            {/* Headline */}
            <h1 className="anim-fade-up d-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Direct Sellers.
              <br />
              Real Buyers.
              <br />
              <span className="text-green-400">No Fakes.</span>
            </h1>

            <p className="anim-fade-up d-200 text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Every property GPS-verified. Backed by live photos.Every buyer
              pays ₹299 to bid. No exceptions. Only serious deals.
            </p>

            {/* Trust pillars */}
            <div className="anim-fade-up d-300 flex flex-wrap gap-5 mb-10">
              {trustPillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Icon className="text-green-400 text-base" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-white/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="anim-fade-up d-400 flex flex-wrap gap-4 mb-12">
              <Link
                href="/post-property"
                className="inline-flex items-center gap-2 px-7 py-4 bg-green-500 text-white text-sm font-bold rounded-2xl hover:bg-green-400 transition-all shadow-lg shadow-green-900/30 hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                Post Property <RiAddLine className="text-base" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                <RiMapPin2Line className="text-base" /> Explore Map
              </Link>
            </div>

            {/* Stats */}
            <div className="anim-fade-up d-500 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="text-2xl font-extrabold text-white">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Phone mockup ── */}
          <div className="anim-fade-right d-200 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-75" />

              {/* Phone */}
              <div className="relative anim-float bg-gray-900 rounded-[3rem] p-2.5 shadow-2xl border border-white/10 z-10">
                <div className="bg-white rounded-[2.5rem] overflow-hidden w-64">
                  {/* Notch */}
                  <div className="h-7 bg-gray-900 flex items-center justify-center rounded-t-[2.5rem]">
                    <div className="w-24 h-4 bg-black rounded-full" />
                  </div>

                  {/* Map area */}
                  <div className="relative h-56 bg-green-50 overflow-hidden">
                    {/* Road grid */}
                    <div className="absolute top-[35%] left-0 right-0 h-2 bg-white/80" />
                    <div className="absolute top-[65%] left-0 right-0 h-1 bg-white/60" />
                    <div className="absolute left-[30%] top-0 bottom-0 w-2 bg-white/80" />
                    <div className="absolute left-[65%] top-0 bottom-0 w-1 bg-white/60" />
                    {/* Blocks */}
                    {[
                      [5, 5, 23, 28],
                      [35, 5, 27, 28],
                      [5, 42, 22, 22],
                      [35, 42, 27, 22],
                      [68, 5, 27, 22],
                      [68, 35, 27, 28],
                    ].map(([l, t, w, h], i) => (
                      <div
                        key={i}
                        className="absolute bg-green-100 rounded-sm"
                        style={{
                          left: `${l}%`,
                          top: `${t}%`,
                          width: `${w}%`,
                          height: `${h}%`,
                        }}
                      />
                    ))}
                    {/* Pins */}
                    {[
                      { top: "22%", left: "42%" },
                      { top: "18%", left: "72%" },
                      { top: "52%", left: "18%" },
                      { top: "55%", left: "55%" },
                    ].map((pos, i) => (
                      <div key={i} className="absolute" style={pos}>
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    ))}
                    {/* Search */}
                    <div className="absolute top-3 left-3 right-3">
                      <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-md">
                        <RiMapPin2Line className="text-gray-400 text-sm" />
                        <span className="text-xs text-gray-400">
                          Search location...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card inside phone */}
                  <div className="p-3.5">
                    <div className="relative h-28 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl mb-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-lg">
                        VERIFIED
                      </span>
                      <div className="absolute bottom-2 left-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <RiStarFill
                              key={i}
                              className="text-yellow-400 text-xs"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      3 BHK Independent House
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 mb-2">
                      <RiMapPin2Line className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-400">
                        Whitefield, Bengaluru
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-gray-900">
                        ₹1.25 Cr
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 font-semibold rounded-lg">
                        Price-Filtered
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      1,850 sq.ft · 3 Beds · 3 Baths
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-8 -right-6 lg:-right-14 flex flex-col gap-2.5 z-20">
                {floatingCards.map((c, i) => (
                  <div
                    key={i}
                    className={`w-48 ${c.bg} rounded-2xl shadow-xl border border-gray-100 p-3 flex gap-2.5 items-center card-hover`}
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-200 rounded-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {c.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {c.location}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-extrabold text-gray-900">
                          {c.price}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded-lg font-medium">
                          {c.trust}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 z-20">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <RiShieldCheckLine className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Zero Fake Listings
                  </p>
                  <p className="text-xs text-gray-400">
                    GPS + Live photo verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16"
        >
          <path
            d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
