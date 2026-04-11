"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiBuilding2Line,
  RiShieldCheckLine,
  RiUserLine,
  RiAuctionLine,
  RiMoneyDollarCircleLine,
  RiAlertLine,
  RiLogoutBoxLine,
  RiHome4Fill,
} from "react-icons/ri";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { href: "/admin/properties", label: "Properties", icon: RiBuilding2Line },
  {
    href: "/admin/verification",
    label: "Verification Queue",
    icon: RiShieldCheckLine,
  },
  { href: "/admin/users", label: "Users", icon: RiUserLine },
  { href: "/admin/bids", label: "Bids", icon: RiAuctionLine },
  { href: "/admin/payments", label: "Payments", icon: RiMoneyDollarCircleLine },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 min-h-screen bg-gray-950 border-r border-gray-800 flex flex-col fixed top-0 left-0 z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <RiHome4Fill className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              MyPropertyBids
            </p>
            <span className="text-xs bg-green-900 text-green-400 px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="text-base flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-600">Logged in as</p>
          <p className="text-xs text-gray-400 font-semibold">admin</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all"
        >
          <RiLogoutBoxLine className="text-base" />
          Logout
        </button>
      </div>
    </aside>
  );
}
