"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
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

type Severity = "High" | "Medium" | "Low";

type AlertRow = {
  sku: string;
  product: string;
  unit: string;
  shiftLabel: string;
  date: string;
  variance: number;
  severity: Severity;
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

/* ================= HELPERS ================= */

const severityFromVariance = (v: number): Severity => {
  const abs = Math.abs(v);
  if (abs >= 10) return "High";
  if (abs >= 5) return "Medium";
  return "Low";
};

const withinDateRange = (
  date: string,
  range: string,
  from?: string,
  to?: string
) => {
  const ts = new Date(date).getTime();
  if (Number.isNaN(ts)) return false;

  const now = Date.now();

  if (range === "7d") return ts >= now - 7 * 86400000;
  if (range === "30d") return ts >= now - 30 * 86400000;

  if (range === "custom" && from && to) {
    return (
      ts >= new Date(from + "T00:00:00").getTime() &&
      ts <= new Date(to + "T23:59:59").getTime()
    );
  }

  return true;
};

/* ================= COMPONENT ================= */

export default function VarianceAlerts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [page, setPage] = useState(1);

  /* ---------- Filters ---------- */
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "custom">("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= BUILD ALERTS ================= */

  const alerts: AlertRow[] = useMemo(() => {
    const rows: AlertRow[] = [];

    shifts
      .filter(
        (s) =>
          s.status === "ended" &&
          s.openingSnapshot &&
          s.closingSnapshot &&
          s.endedAt
      )
      .forEach((shift) => {
        products.forEach((product) => {
          const opening =
            shift.openingSnapshot!.find(
              (i: StockSnapshot) => i.sku === product.sku
            )?.quantity || 0;

          const closing =
            shift.closingSnapshot!.find(
              (i: StockSnapshot) => i.sku === product.sku
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

          if (variance === 0) return;

          const sev = severityFromVariance(variance);

          if (
            !withinDateRange(
              shift.endedAt!,
              dateRange,
              fromDate,
              toDate
            )
          )
            return;

          if (severity !== "all" && sev !== severity) return;

          if (
            search &&
            !product.name.toLowerCase().includes(search.toLowerCase()) &&
            !product.sku.toLowerCase().includes(search.toLowerCase())
          )
            return;

          rows.push({
            sku: product.sku,
            product: product.name,
            unit: product.unit,
            shiftLabel: shift.label,
            date: shift.endedAt!,
            variance,
            severity: sev,
          });
        });
      });

    return rows.sort(
      (a, b) => Math.abs(b.variance) - Math.abs(a.variance)
    );
  }, [
    shifts,
    products,
    logs,
    dateRange,
    fromDate,
    toDate,
    severity,
    search,
  ]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE));
  const pageData = alerts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={18} />
          Variance Alerts
        </h2>
        <p className="text-sm text-gray-500">
          Actionable stock discrepancies detected after shift closure.
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          value={dateRange}
          onChange={(e) => {
            setPage(1);
            setDateRange(e.target.value as any);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
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

        <select
          value={severity}
          onChange={(e) => {
            setPage(1);
            setSeverity(e.target.value as any);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          placeholder="Search product or SKU"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Severity</th>
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No variance alerts found
                </td>
              </tr>
            )}

            {pageData.map((v, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{v.date}</td>
                <td className="px-4 py-3 font-medium">{v.product}</td>
                <td className="px-4 py-3 text-right text-red-600 font-semibold">
                  {v.variance}
                </td>
                <td className="px-4 py-3">{v.unit}</td>
                <td className="px-4 py-3">{v.shiftLabel}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={v.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-between items-center text-sm text-gray-500">
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
  );
}

/* ================= UI HELPERS ================= */

function SeverityBadge({ severity }: { severity: Severity }) {
  const map = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${map[severity]}`}
    >
      {severity}
    </span>
  );
}
