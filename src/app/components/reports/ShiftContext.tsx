"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Package,
} from "lucide-react";
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

type ShiftVarianceItem = {
  product: string;
  unit: string;
  variance: number;
};

type ShiftVariance = {
  shiftId: string;
  shiftLabel: string;
  date: string;
  staff: string[];
  items: ShiftVarianceItem[];
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 5;

/* ================= MAIN ================= */

export default function ShiftContext() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [dateRange, setDateRange] = useState("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [activeShift, setActiveShift] =
    useState<ShiftVariance | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= DATE BOUNDS ================= */

  const dateBounds = useMemo(() => {
    const ended = shifts
      .filter((s) => s.status === "ended" && s.endedAt)
      .map((s) => new Date(s.endedAt!).getTime());

    if (!ended.length) return null;

    const latest = Math.max(...ended);
    let fromTs = 0;
    let toTs = latest;

    if (dateRange === "today") {
      const d = new Date(latest);
      d.setHours(0, 0, 0, 0);
      fromTs = d.getTime();
    }

    if (dateRange === "7d") fromTs = latest - 7 * 86400000;
    if (dateRange === "1m") fromTs = latest - 30 * 86400000;
    if (dateRange === "2m") fromTs = latest - 60 * 86400000;

    if (dateRange === "custom") {
      if (!fromDate || !toDate) return null;
      fromTs = new Date(fromDate + "T00:00:00").getTime();
      toTs = new Date(toDate + "T23:59:59").getTime();
    }

    return { fromTs, toTs };
  }, [dateRange, fromDate, toDate, shifts]);

  /* ================= BUILD SHIFT VARIANCE ================= */

  const shiftVariance = useMemo<ShiftVariance[]>(() => {
    const results: ShiftVariance[] = [];

    shifts.forEach((shift) => {
      if (
        shift.status !== "ended" ||
        !shift.openingSnapshot ||
        !shift.closingSnapshot ||
        !shift.endedAt
      )
        return;

      const endedTs = new Date(shift.endedAt).getTime();
      if (dateBounds) {
        if (endedTs < dateBounds.fromTs) return;
        if (endedTs > dateBounds.toTs) return;
      }

      const items: ShiftVarianceItem[] = [];

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
          items.push({
            product: p.name,
            unit: p.unit,
            variance,
          });
        }
      });

      if (items.length > 0) {
        results.push({
          shiftId: shift.id,
          shiftLabel: shift.label,
          date: shift.endedAt.split(",")[0],
          staff: shift.staff.map((s) => s.fullName),
          items,
        });
      }
    });

    return results.sort((a, b) =>
      a.date < b.date ? 1 : -1
    );
  }, [shifts, products, logs, dateBounds]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(shiftVariance.length / PAGE_SIZE)
  );

  const pageData = shiftVariance.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-[#0F766E]">
            Shift Variance Context
          </h3>
          <p className="text-xs text-gray-500">
            Shifts with confirmed stock discrepancies
          </p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Filter size={14} /> Date filter
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="1m">Last 1 month</option>
              <option value="2m">Last 2 months</option>
              <option value="custom">Custom range</option>
            </select>

            {dateRange === "custom" && (
              <>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y">
          {pageData.map((s) => (
            <button
              key={s.shiftId}
              onClick={() => setActiveShift(s)}
              className="w-full p-4 text-left hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-medium">
                  {s.shiftLabel} Shift
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> {s.date}
                </p>
              </div>

              <p className="text-xs text-gray-600">
                Staff:{" "}
                <span className="text-gray-800">
                  {s.staff.join(", ")}
                </span>
              </p>

              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <AlertTriangle size={14} />
                {s.items.length} items affected
              </div>
            </button>
          ))}

          {pageData.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No shift variance for selected period
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between text-xs text-gray-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 border rounded-md disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 border rounded-md disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {activeShift && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-4 border-b flex justify-between">
              <h4 className="font-semibold">
                {activeShift.shiftLabel} – {activeShift.date}
              </h4>
              <button onClick={() => setActiveShift(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
              {activeShift.items.map((i, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 flex justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span className="font-medium">
                      {i.product}
                    </span>
                  </div>

                  <span
                    className={`font-semibold ${
                      i.variance < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {i.variance > 0 ? "+" : ""}
                    {i.variance}
                    {i.unit}
                  </span>
                </div>
              ))}

              <p className="text-xs text-gray-500 pt-2">
                Staff on duty:{" "}
                <span className="text-gray-700">
                  {activeShift.staff.join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
