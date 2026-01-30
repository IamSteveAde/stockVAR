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
import { Shift } from "../shifts/types";

/* ================= STORAGE KEYS ================= */

const PRODUCTS_KEY = "stockvar_products";
const SHIFTS_KEY = "stockvar_shifts";
const LOGS_KEY = "stockvar_inventory_logs";
const STAFF_KEY = "stockvar_staff";

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
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
    setStaff(JSON.parse(localStorage.getItem(STAFF_KEY) || "[]"));
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

  const searchIndex = useMemo(() => {
    return [
      ...products.map((p) => ({
        label: p.name,
        type: "Product",
        path: "/dashboard/stock",
      })),
      ...staff.map((s) => ({
        label: s.fullName,
        type: "Staff",
        path: "/dashboard/staff",
      })),
      ...shifts.map((s) => ({
        label: s.label,
        type: "Shift",
        path: "/dashboard/shift",
      })),
      {
        label: "Stock Variance Report",
        type: "Report",
        path: "/dashboard/reports",
      },
    ];
  }, [products, staff, shifts]);

  const searchResults =
    query.length > 0
      ? searchIndex.filter((i) =>
          i.label.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  /* ================= UI ================= */

  return (
    <header
      ref={wrapperRef}
      className="sticky top-0 z-40 h-16 bg-[#19464b] flex items-center justify-between px-4 md:px-6"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white"
        >
          <Menu size={20} />
        </button>

        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/logo/stockvarwm.svg"   // 🔁 change if needed
            alt="Stockvar"
            width={120}
            height={32}
            priority
            className="h-7 sm:h-8 md:h-9 w-auto"
          />
        </Link>

        {/* SEARCH (Tablet + Desktop) */}
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
            <div className="absolute top-11 w-full bg-white rounded-xl shadow-lg border">
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No results
                </div>
              ) : (
                searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery("");
                      setOpenSearch(false);
                      router.push(r.path);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    <p className="text-xs text-gray-400">{r.type}</p>
                    <p className="font-medium">{r.label}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
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

        {/* USER */}
        <div className="relative">
          <button
            onClick={() => setOpenUserMenu((v) => !v)}
            className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs"
          >
            {profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
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
