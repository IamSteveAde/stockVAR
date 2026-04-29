"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { Shift } from "../shifts/types";

/* ================= STORAGE KEYS ================= */

const PRODUCTS_KEY = "stockvar_products";
const SHIFTS_KEY = "stockvar_shifts";
const LOGS_KEY = "stockvar_inventory_logs";

import { apiFetchFirstSuccess } from "@/lib/api/client";
import { getSession } from "@/lib/api/auth";

type SearchResult = {
  text: string;
  source: string;
};

/* ================= TYPES ================= */

type Product = {
  sku: string;
  name: string;
  unit: string;
};

type InventoryLog = {
  sku: string;
  quantity: number;
  action: "in" | "out";
  shiftId: string;
};

type SnapshotItem = {
  sku: string;
  quantity: number;
};

type NotificationItem = {
  id: string;
  message: string;
};

/* ================= COMPONENT ================= */

type TopbarProps = {
  toggleSidebar: () => void;
};

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const { profile } = useProfile();
  const { subscription, trialDaysLeft } = useSubscription();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
        setOpenNotifications(false);
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= REAL VARIANCE NOTIFICATIONS ================= */

  const notifications = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    shifts.forEach((shift) => {
      if (
        shift.status !== "ended" ||
        !shift.openingSnapshot ||
        !shift.closingSnapshot
      )
        return;

      products.forEach((product) => {
        const opening =
          shift.openingSnapshot!.find(
            (i: SnapshotItem) => i.sku === product.sku
          )?.quantity || 0;

        const closing =
          shift.closingSnapshot!.find(
            (i: SnapshotItem) => i.sku === product.sku
          )?.quantity || 0;

        const shiftLogs = logs.filter(
          (l) => l.shiftId === shift.id && l.sku === product.sku
        );

        const added = shiftLogs
          .filter((l) => l.action === "in")
          .reduce((s, l) => s + l.quantity, 0);

        const used = shiftLogs
          .filter((l) => l.action === "out")
          .reduce((s, l) => s + l.quantity, 0);

        const expected = opening + added - used;
        const variance = closing - expected;

        if (variance !== 0) {
          list.push({
            id: `${shift.id}-${product.sku}`,
            message: `${product.name} variance ${
              variance > 0 ? "+" : ""
            }${variance}${product.unit} (${shift.label})`,
          });
        }
      });
    });

    return list.slice(0, 6);
  }, [shifts, logs, products]);

  useEffect(() => {
    setHasUnread(notifications.length > 0);
  }, [notifications]);

  /* ================= SEARCH INDEX ================= */

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchPage(1);
      setHasNextPage(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchPage(1);
      try {
        const token = getSession()?.token;
        if (!token) return;

        const res: any = await apiFetchFirstSuccess(
          [`api/search?text=${encodeURIComponent(query.trim())}&page=1`],
          { token }
        );

        setSearchResults(res.data?.results || []);
        setHasNextPage(!res.data?.meta?.isLastPage);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
        setHasNextPage(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const loadMoreSearch = async () => {
    if (!hasNextPage || isLoadingMore || isSearching) return;
    
    setIsLoadingMore(true);
    const nextPage = searchPage + 1;
    try {
      const token = getSession()?.token;
      if (!token) return;

      const res: any = await apiFetchFirstSuccess(
        [`api/search?text=${encodeURIComponent(query.trim())}&page=${nextPage}`],
        { token }
      );

      setSearchResults(prev => [...prev, ...(res.data?.results || [])]);
      setHasNextPage(!res.data?.meta?.isLastPage);
      setSearchPage(nextPage);
    } catch (err) {
      console.error("Search load more failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // trigger when near bottom (10px)
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      loadMoreSearch();
    }
  };

  const handleSearchSelect = (result: SearchResult) => {
    setQuery("");
    setOpenSearch(false);
    
    const source = String(result.source || "").toLowerCase().trim();
    let path = "";
    
    if (source.includes("product") || source.includes("stock") || source.includes("inventory")) {
      path = `/dashboard/stock?search=${encodeURIComponent(result.text)}`;
    } else if (source.includes("staff")) {
      path = `/dashboard/staff?search=${encodeURIComponent(result.text)}`;
    } else if (source.includes("shift")) {
      path = `/dashboard/shift?search=${encodeURIComponent(result.text)}`;
    } else {
      // Fallback
      console.warn("Unknown search source:", result);
      path = `/dashboard`;
    }
    
    router.push(path);
  };

  /* ================= UI ================= */

  return (
    <header
      ref={wrapperRef}
      className="sticky top-0 z-20 h-16 bg-[#19464b] flex items-center justify-between px-4 md:px-6"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden text-white">
          <Menu size={20} />
        </button>

        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/logo/stockvarwm.svg"
            alt="Stockvar"
            width={120}
            height={32}
            priority
            className="h-7 sm:h-8 md:h-9 w-auto"
          />
        </Link>

        <div className="relative hidden md:block w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
          />
          <input
            value={query}
            onFocus={() => setOpenSearch(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, staff, shifts…"
            className="w-full bg-white/10 text-white rounded-lg pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          {openSearch && query && (
            <div 
              className="absolute top-11 w-full bg-white rounded-xl shadow-lg border max-h-96 overflow-y-auto"
              onScroll={handleSearchScroll}
            >
              {isSearching ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                <>
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchSelect(r)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0"
                    >
                      <p className="text-xs text-gray-400 capitalize">{r.source}</p>
                      <p className="font-medium text-gray-900">{r.text}</p>
                    </button>
                  ))}
                  {isLoadingMore && (
                    <div className="px-4 py-3 text-sm text-center text-gray-500">
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* TRIAL PILL */}
        {subscription?.status === "trial" && trialDaysLeft !== null && (
          <Link 
             href="/dashboard/billing" 
             className="hidden md:flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition shadow-sm"
          >
            Trial: {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
          </Link>
        )}

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications((v) => !v);
              setHasUnread(false);
            }}
            className="relative text-white"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border">
              <div className="px-4 py-3 border-b font-medium">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No new alerts
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b text-sm flex gap-2"
                  >
                    <AlertTriangle size={16} className="text-red-600" />
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenUserMenu((v) => !v)}
            className="h-8 w-8 overflow-hidden rounded-full bg-white/20 flex items-center justify-center text-white text-xs"
            aria-label="Open user menu"
          >
            {profile.profileUrl ? (
              <Image
                key={profile.profileUrl}
                src={profile.profileUrl}
                alt={profile.fullName}
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
              />
            ) : (
              profile.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
            )}
          </button>

          {openUserMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border">
              <Link
                href="/dashboard/profile"
                className="flex gap-2 px-4 py-3 text-sm hover:bg-gray-50"
              >
                <User size={16} /> Profile
              </Link>

              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/auth/login");
                }}
                className="w-full flex gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
