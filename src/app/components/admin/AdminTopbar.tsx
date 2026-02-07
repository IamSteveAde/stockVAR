"use client";

import { usePathname } from "next/navigation";

/* ================= HELPERS ================= */

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Overview";
  if (pathname.startsWith("/admin/restaurants"))
    return "Restaurants";
  if (pathname.startsWith("/admin/users"))
    return "Users";
  if (pathname.startsWith("/admin/subscriptions"))
    return "Subscriptions";
  if (pathname.startsWith("/admin/analytics"))
    return "Analytics";
  return "Admin";
}

/* ================= COMPONENT ================= */

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      {/* Left: page context */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {title}
        </span>
        <span className="text-xs text-gray-500">
          System admin panel
        </span>
      </div>

      {/* Right: identity */}
      <div className="flex items-center gap-3 text-sm">
        <div className="text-right">
          <p className="font-medium text-gray-900">
            Admin
          </p>
          <p className="text-xs text-gray-500">
            Super administrator
          </p>
        </div>

        <div className="h-8 w-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
