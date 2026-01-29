"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

type TopbarProps = {
  toggleSidebar: () => void;
};

/* ================= MOCK SEARCH DATA ================= */
const SEARCH_DATA = [
  { type: "Product", label: "Rice stock" },
  { type: "Product", label: "Oil variance" },
  { type: "Staff", label: "John (Staff)" },
  { type: "Staff", label: "Aisha (Manager)" },
  { type: "Report", label: "January variance report" },
  { type: "Shift", label: "Morning shift" },
];

/* ================= NOTIFICATIONS ================= */
const NOTIFICATIONS = [
  "Variance detected: Rice (-12kg)",
  "New staff added: Samuel",
  "Shift assigned: Night",
  "Stock updated: Oil",
  "Login from new device",
];

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const { profile } = useProfile();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ================= CLICK OUTSIDE HANDLER ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpenSearch(false);
        setOpenNotifications(false);
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= SEARCH RESULTS ================= */
  const results =
    query.length > 0
      ? SEARCH_DATA.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <header
      ref={wrapperRef}
      className="relative z-40 h-16 bg-[#19464b] border-b border-white/10 flex items-center justify-between px-4 md:px-6"
    >
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white/90 hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo (mobile only) */}
        <div className="lg:hidden">
          <Image
            src="/images/logo/stockvarwm.svg"
            alt="StockVAR"
            width={90}
            height={24}
            priority
          />
        </div>

        {/* Search (desktop) */}
        <div className="relative hidden md:block w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
          />

          <input
            value={query}
            onFocus={() => setOpenSearch(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock, staff, shifts…"
            className="w-full bg-white/10 text-sm text-white placeholder:text-white/50 rounded-lg pl-10 pr-8 py-2 outline-none focus:bg-white/15"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <X size={14} />
            </button>
          )}

          {/* SEARCH RESULTS */}
          {openSearch && query && (
            <div className="absolute top-11 left-0 w-full bg-white rounded-xl shadow-lg border overflow-hidden">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setOpenSearch(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    <span className="text-xs text-gray-400">{r.type}</span>
                    <div className="font-medium">{r.label}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications((v) => !v);
              setHasUnread(false);
            }}
            className="relative text-white/80 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 top-10 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border overflow-hidden">
              <div className="px-4 py-3 border-b font-medium text-sm">
                Notifications
              </div>

              <div className="max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 text-sm border-b last:border-b-0"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpenUserMenu((v) => !v)}
            className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20"
            aria-label="User menu"
          >
            {profile.avatar ? (
              <Image
                key={profile.avatar}
                src={profile.avatar}
                alt={profile.fullName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-medium text-white">
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </button>

          {openUserMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border overflow-hidden">
              <Link
                href="/dashboard/profile"
                onClick={() => setOpenUserMenu(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={16} />
                Profile
              </Link>

              <Link
                href="/dashboard/account"
                onClick={() => setOpenUserMenu(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings size={16} />
                Settings
              </Link>

              <div className="h-px bg-gray-100" />

              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  setOpenUserMenu(false);
                  router.push("/auth/login");
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
