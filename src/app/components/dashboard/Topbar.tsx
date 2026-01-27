"use client";

import Image from "next/image";
import { Menu, Bell, Search } from "lucide-react";

type TopbarProps = {
  toggleSidebar: () => void;
};

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo — MOBILE ONLY */}
        <div className="lg:hidden">
          <Image
            src="/images/logo/stockvars.svg"
            alt="StockVAR"
            width={90}
            height={24}
            priority
          />
        </div>

        {/* Search — DESKTOP ONLY */}
        <div className="relative hidden md:block lg:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search..."
            className="border rounded-lg pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Bell size={18} />
        <div className="h-8 w-8 rounded-full bg-[#0F766E]/10" />
      </div>
    </header>
  );
}
