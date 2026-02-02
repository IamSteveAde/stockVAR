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
  Users,
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

type Snapshot = {
  sku: string;
  quantity: number;
};

type ReconciliationItem = {
  product: string;
  unit: string;
  opening: number;
  added: number;
  used: number;
  expected: number;
  actual: number;
  variance: number;
};

type ShiftContextRow = {
  id: string;
  label: string;
  endedAt: string;
  staff: string[];
  items: ReconciliationItem[];
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 5;

/* ================= HELPERS ================= */

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ================= COMPONENT ================= */

export default function ShiftContext() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [range, setRange] = useState("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [active, setActive] =
    useState<ShiftContextRow | null>(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= DATE FILTER ================= */

  const bounds = useMemo(() => {
    const ended = shifts
      .filter((s) => s.status === "ended" && s.endedAt)
      .map((s) => new Date(s.endedAt!).getTime());

    if (!ended.length) return null;

    const latest = Math.max(...ended);
    let from = 0;
    let to = latest;

    if (range === "today") {
      const d = new Date(latest);
      d.setHours(0, 0, 0, 0);
      from = d.getTime();
    }

    if (range === "7d") from = latest - 7 * 86400000;
    if (range === "1m") from = latest - 30 * 86400000;
    if (range === "2m") from = latest - 60 * 86400000;

    if (range === "custom" && fromDate && toDate) {
      from = new Date(fromDate + "T00:00:00").getTime();
      to = new Date(toDate + "T23:59:59").getTime();
    }

    return { from, to };
  }, [range, fromDate, toDate, shifts]);

  /* ================= BUILD CONTEXT ================= */

  const rows = useMemo<ShiftContextRow[]>(() => {
    const out: ShiftContextRow[] = [];

    shifts.forEach((shift) => {
      if (
        shift.status !== "ended" ||
        !shift.openingSnapshot ||
        !shift.closingSnapshot ||
        !shift.endedAt
      )
        return;

      const endedTs = new Date(shift.endedAt).getTime();
      if (bounds) {
        if (endedTs < bounds.from) return;
        if (endedTs > bounds.to) return;
      }

      const items: ReconciliationItem[] = [];

      products.forEach((p) => {
        const opening =
          shift.openingSnapshot!.find(
            (i: Snapshot) => i.sku === p.sku
          )?.quantity || 0;

        const actual =
          shift.closingSnapshot!.find(
            (i: Snapshot) => i.sku === p.sku
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
        const variance = actual - expected;

        if (variance !== 0) {
          items.push({
            product: p.name,
            unit: p.unit,
            opening,
            added,
            used,
            expected,
            actual,
            variance,
          });
        }
      });

      if (items.length) {
        out.push({
          id: shift.id,
          label: shift.label,
          endedAt: shift.endedAt,
          staff: shift.staff.map((s) => s.fullName),
          items,
        });
      }
    });

    return out.sort(
      (a, b) =>
        new Date(b.endedAt).getTime() -
        new Date(a.endedAt).getTime()
    );
  }, [shifts, products, logs, bounds]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / PAGE_SIZE)
  );

  const pageData = rows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-[#0F766E]">
            Shift Context Report
          </h3>
          <p className="text-xs text-gray-500">
            Reconciliation of ended shifts with stock discrepancies
          </p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Filter size={14} /> Date range
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="1m">Last 1 month</option>
              <option value="2m">Last 2 months</option>
              <option value="custom">Custom</option>
            </select>

            {range === "custom" && (
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
              key={s.id}
              onClick={() => setActive(s)}
              className="w-full p-4 text-left hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-medium">
                  {s.label} Shift
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(s.endedAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users size={14} />
                {s.staff.join(", ")}
              </div>

              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <AlertTriangle size={14} />
                {s.items.length} items affected
              </div>
            </button>
          ))}

          {pageData.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No discrepancies for selected period
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
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-xl">
            <div className="p-4 border-b flex justify-between">
              <h4 className="font-semibold">
                {active.label} – {formatDate(active.endedAt)}
              </h4>
              <button onClick={() => setActive(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {active.items.map((i, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex justify-between">
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

                  <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                    <div>
                      <p className="text-gray-400">Opening</p>
                      <p>{i.opening}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Added</p>
                      <p>{i.added}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Used</p>
                      <p>{i.used}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expected</p>
                      <p>{i.expected}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Actual</p>
                      <p>{i.actual}</p>
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-500 pt-2">
                Staff on duty:{" "}
                <span className="text-gray-700">
                  {active.staff.join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
