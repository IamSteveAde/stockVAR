"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ================= NAV CONFIG ================= */

const NAV_ITEMS = [
  { label: "Overview", href: "/admin" },
  { label: "Restaurants", href: "/admin/restaurants" },
  { label: "Users", href: "/admin/users" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Analytics", href: "/admin/analytics" },
];

/* ================= COMPONENT ================= */

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-[#0F766E]">
          StockVAR Admin
        </h2>
        <p className="text-xs text-gray-500">
          Control console
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 text-sm">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block rounded-lg px-3 py-2 transition
                ${
                  active
                    ? "bg-[#0F766E]/10 text-[#0F766E] font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} StockVAR
      </div>
    </aside>
  );
}
