"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  ArrowRight,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Shift } from "../shifts/types";

/* ================= STORAGE KEYS ================= */

const PRODUCTS_KEY = "stockvar_products";
const SHIFTS_KEY = "stockvar_shifts";
const LOGS_KEY = "stockvar_inventory_logs";

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

type StockSnapshot = {
  sku: string;
  quantity: number;
};

type ShiftVarianceSummary = {
  shiftId: string;
  label: string;
  date: string;
  staff: string[];
  affectedItems: number;
  totalVariance: number;
};

/* ================= COMPONENT ================= */

export default function VarStatus() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [dateRange, setDateRange] =
    useState<"today" | "7d" | "1m">("7d");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = () => {
      setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
      setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
      setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
    };

    load();
    window.addEventListener("stockvar:updated", load);
    return () =>
      window.removeEventListener("stockvar:updated", load);
  }, []);

  /* ================= DATE WINDOW ================= */

  const dateWindow = useMemo(() => {
    const ended = shifts
      .filter((s) => s.status === "ended" && s.endedAt)
      .map((s) => new Date(s.endedAt!).getTime());

    if (!ended.length) return null;

    const latest = Math.max(...ended);
    let from = 0;

    if (dateRange === "today") {
      const d = new Date(latest);
      d.setHours(0, 0, 0, 0);
      from = d.getTime();
    }

    if (dateRange === "7d") from = latest - 7 * 86400000;
    if (dateRange === "1m") from = latest - 30 * 86400000;

    return { from, to: latest };
  }, [dateRange, shifts]);

  /* ================= BUILD SUMMARY ================= */

  const summary = useMemo<ShiftVarianceSummary[]>(() => {
    if (!dateWindow) return [];

    const results: ShiftVarianceSummary[] = [];

    shifts.forEach((shift) => {
      if (
        shift.status !== "ended" ||
        !shift.openingSnapshot ||
        !shift.closingSnapshot ||
        !shift.endedAt
      )
        return;

      const endedTs = new Date(shift.endedAt).getTime();
      if (endedTs < dateWindow.from || endedTs > dateWindow.to)
        return;

      let affectedItems = 0;
      let totalVariance = 0;

      products.forEach((p) => {
        const opening =
          shift.openingSnapshot!.find(
            (i: StockSnapshot) => i.sku === p.sku
          )?.quantity || 0;

        const closing =
          shift.closingSnapshot!.find(
            (i: StockSnapshot) => i.sku === p.sku
          )?.quantity || 0;

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
        const variance = closing - expected;

        if (variance !== 0) {
          affectedItems += 1;
          totalVariance += Math.abs(variance);
        }
      });

      if (affectedItems > 0) {
        results.push({
          shiftId: shift.id,
          label: shift.label,
          date: shift.endedAt.split(",")[0],
          staff: shift.staff.map((s) => s.fullName),
          affectedItems,
          totalVariance,
        });
      }
    });

    return results.sort(
      (a, b) => b.totalVariance - a.totalVariance
    );
  }, [shifts, products, logs, dateWindow]);

  const worstShift = summary[0];

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#0F766E]">
          VAR Overview
        </h3>
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="text-xs text-[#0F766E] flex items-center gap-1 hover:underline"
        >
          View full report
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={14} className="text-gray-400" />
        <select
          value={dateRange}
          onChange={(e) =>
            setDateRange(e.target.value as any)
          }
          className="border rounded-lg px-2 py-1 text-xs"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="1m">Last 30 days</option>
        </select>
      </div>

      {/* Content */}
      {summary.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">
          No variance detected
        </div>
      ) : (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">
                Affected shifts
              </p>
              <p className="text-lg font-semibold">
                {summary.length}
              </p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">
                Total discrepancies
              </p>
              <p className="text-lg font-semibold text-red-600">
                {summary.reduce(
                  (s, r) => s + r.affectedItems,
                  0
                )}
              </p>
            </div>
          </div>

          {/* Worst shift */}
          {worstShift && (
            <div className="border rounded-lg p-4 bg-red-50 space-y-2">
              <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                <AlertTriangle size={14} />
                Highest variance shift
              </div>

              <p className="font-medium">
                {worstShift.label} shift
              </p>

              <p className="text-xs text-gray-600">
                {worstShift.date} •{" "}
                {worstShift.affectedItems} items affected
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users size={12} />
                <span className="truncate">
                  {worstShift.staff.join(", ")}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
