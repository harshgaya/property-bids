import Link from 'next/link'
import { RiHome4Fill, RiMapPin2Line, RiPhoneLine, RiMailLine, RiInstagramLine, RiTwitterXLine, RiLinkedinBoxLine, RiFacebookBoxLine, RiYoutubeLine } from 'react-icons/ri'
import { SITE, SOCIAL } from '@/constants'

const links = {
  'For Buyers':  [{ l:'Search Properties',href:'/buy'},{l:'Map Search',href:'/map'},{l:'How It Works',href:'/how-it-works'},{l:'Legal Verified',href:'/buy?trust=legal'}],
  'For Sellers': [{ l:'Post Property',href:'/post-property'},{l:'Why Sell Here',href:'/sell'},{l:'Pricing Plans',href:'/pricing'},{l:'Seller Dashboard',href:'/dashboard'}],
  'Company':     [{ l:'About Us',href:'/about'},{l:'How It Works',href:'/how-it-works'},{l:'Blog',href:'/blog'},{l:'Contact',href:'/contact'}],
  'Legal':       [{ l:'Privacy Policy',href:'/privacy'},{l:'Terms of Service',href:'/terms'},{l:'Refund Policy',href:'/refund'}],
}

const socials = [
  { icon: RiInstagramLine, href: SOCIAL.instagram, label: 'Instagram' },
  { icon: RiTwitterXLine,  href: SOCIAL.twitter,   label: 'Twitter' },
  { icon: RiLinkedinBoxLine,href: SOCIAL.linkedin,  label: 'LinkedIn' },
  { icon: RiFacebookBoxLine,href: SOCIAL.facebook,  label: 'Facebook' },
  { icon: RiYoutubeLine,   href: SOCIAL.youtube,   label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <RiHome4Fill className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">Property<span className="text-green-500">Bids</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              {SITE.description}
            </p>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-start gap-2">
                <RiMapPin2Line className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>{SITE.address.line1}, {SITE.address.line2}, {SITE.address.city} — {SITE.address.pin}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiPhoneLine className="text-green-500 flex-shrink-0" />
                <a href={`tel:${SITE.phone}`} className="hover:text-green-400 transition-colors">{SITE.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <RiMailLine className="text-green-500 flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-green-400 transition-colors">{SITE.email}</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href || item.l}>
                    <Link href={item.href || '#'} className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} {SITE.fullName} · All rights reserved.</p>
          <p className="text-xs text-gray-700 font-medium">Built for trust. Built for India. 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
