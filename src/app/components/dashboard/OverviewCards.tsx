"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  Users,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

type Staff = {
  id: string;
  status: "active" | "invited" | "archived";
};

type SnapshotItem = {
  sku: string;
  quantity: number;
};

type Shift = {
  id: string;
  status: "created" | "started" | "ended";
  openingSnapshot?: SnapshotItem[];
  closingSnapshot?: SnapshotItem[];
};

/* ================= COMPONENT ================= */

export default function OverviewCards() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = () => {
      setProducts(
        JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]")
      );
      setShifts(
        JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]")
      );
      setLogs(
        JSON.parse(localStorage.getItem(LOGS_KEY) || "[]")
      );
      setStaff(
        JSON.parse(localStorage.getItem(STAFF_KEY) || "[]")
      );
    };

    load();
    window.addEventListener("stockvar:updated", load);
    return () =>
      window.removeEventListener("stockvar:updated", load);
  }, []);

  /* ================= METRICS ================= */

  /** 1️⃣ Total stock items */
  const totalItems = products.length;

  /** 2️⃣ Active staff count */
  const activeStaffCount = staff.filter(
    (s) => s.status === "active"
  ).length;

  /** 3️⃣ Unresolved variance from ended shifts */
  const unresolvedVariance = useMemo(() => {
    let variance = 0;

    shifts.forEach((shift) => {
      if (
        shift.status !== "ended" ||
        !shift.openingSnapshot ||
        !shift.closingSnapshot
      )
        return;

      products.forEach((p) => {
        const opening =
          shift.openingSnapshot?.find(
            (i) => i.sku === p.sku
          )?.quantity ?? 0;

        const closing =
          shift.closingSnapshot?.find(
            (i) => i.sku === p.sku
          )?.quantity ?? 0;

        const shiftLogs = logs.filter(
          (l) => l.shiftId === shift.id && l.sku === p.sku
        );

        const added = shiftLogs
          .filter((l) => l.action === "in")
          .reduce((s, l) => s + l.quantity, 0);

        const used = shiftLogs
          .filter((l) => l.action === "out")
          .reduce((s, l) => s + l.quantity, 0);

        const expected = opening + added - used;
        variance += closing - expected;
      });
    });

    return variance;
  }, [shifts, products, logs]);

  /* ================= CARD CONFIG ================= */

  const cards = [
    {
      title: "Stock Items",
      value: totalItems.toString(),
      icon: Package,
    },
    {
      title: "Unresolved VAR",
      value:
        unresolvedVariance === 0
          ? "0"
          : unresolvedVariance > 0
          ? `+${unresolvedVariance}`
          : `${unresolvedVariance}`,
      icon: AlertTriangle,
      tone:
        unresolvedVariance < 0
          ? "text-red-600"
          : unresolvedVariance > 0
          ? "text-green-600"
          : "",
    },
    {
      title: "Staff",
      value: activeStaffCount.toString(),
      icon: Users,
    },
    {
      title: "Reports",
      value: "View",
      icon: BarChart,
      action: () => router.push("/dashboard/report"),
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(
        ({ title, value, icon: Icon, action, tone }) => (
          <div
            key={title}
            onClick={action}
            className={`bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm ${
              action
                ? "cursor-pointer hover:bg-gray-50"
                : ""
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
              <Icon size={18} className="text-[#0F766E]" />
            </div>

            <div>
              <p className="text-xs text-gray-500">{title}</p>
              <p
                className={`text-lg font-semibold ${
                  tone || ""
                }`}
              >
                {value}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
