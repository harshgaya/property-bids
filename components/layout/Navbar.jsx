'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import {
  RiHome4Fill, RiMenuLine, RiCloseLine, RiAddLine,
  RiArrowDownSLine, RiSearchLine, RiMapPin2Line,
  RiBuilding2Line, RiInformationLine, RiUserLine,
  RiDashboardLine, RiPriceTag3Line, RiShieldCheckLine,
} from 'react-icons/ri'
import { NAV, SITE } from '@/constants'

const iconMap = {
  'Search Properties': RiSearchLine,
  'Map Search':        RiMapPin2Line,
  'How Bidding Works': RiShieldCheckLine,
  'Post Property':     RiAddLine,
  'Seller Landing':    RiBuilding2Line,
  'Pricing Plans':     RiPriceTag3Line,
  'Dashboard':         RiDashboardLine,
  'About Us':          RiInformationLine,
  'How It Works':      RiShieldCheckLine,
  'Blog':              RiInformationLine,
  'Contact':           RiUserLine,
}

function DropdownMenu({ items, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden anim-slide-down z-50">
      {items.map((item) => {
        const Icon = iconMap[item.label] || RiArrowDownSLine
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <Icon className="text-gray-500 group-hover:text-green-600 text-sm transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm font-medium transition-colors px-1 py-1 rounded-lg ${open ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
      >
        {label}
        <RiArrowDownSLine className={`text-base transition-transform duration-200 ${open ? 'rotate-180 text-green-600' : ''}`} />
      </button>
      {open && <DropdownMenu items={items} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <RiHome4Fill className="text-white text-base" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Property<span className="text-green-600">Bids</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavDropdown label="Buy"     items={NAV.buy} />
            <NavDropdown label="Sell"    items={NAV.sell} />
            <NavDropdown label="Company" items={NAV.company} />
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:border-green-500 hover:text-green-600 transition-all">
              Log in
            </Link>
            <Link href="/post-property" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors shadow-sm">
              Post Property <RiAddLine className="text-base" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            {mobileOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 anim-slide-down">
          <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">

            {/* Mobile nav sections */}
            {[
              { label: 'Buy',     items: NAV.buy },
              { label: 'Sell',    items: NAV.sell },
              { label: 'Company', items: NAV.company },
            ].map(({ label, items }) => (
              <div key={label}>
                <button
                  onClick={() => setMobileSection(mobileSection === label ? null : label)}
                  className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800 border-b border-gray-100"
                >
                  {label}
                  <RiArrowDownSLine className={`transition-transform duration-200 ${mobileSection === label ? 'rotate-180 text-green-600' : 'text-gray-400'}`} />
                </button>
                {mobileSection === label && (
                  <div className="py-1 space-y-1 anim-slide-down">
                    {items.map((item) => {
                      const Icon = iconMap[item.label] || RiArrowDownSLine
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
                        >
                          <Icon className="text-green-600 text-base flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 pb-2 flex gap-3">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-sm font-medium border border-gray-300 rounded-xl text-gray-700">
                Log in
              </Link>
              <Link href="/post-property" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-sm font-semibold bg-green-600 text-white rounded-xl">
                Post Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
