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

type AlertRow = {
  sku: string;
  product: string;
  unit: string;
  shiftId: string;
  shiftLabel: string;
  date: string;
  variance: number;
  severity: "High" | "Medium" | "Low";
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

/* ================= HELPERS ================= */

const severityFromVariance = (v: number): AlertRow["severity"] => {
  const abs = Math.abs(v);
  if (abs >= 10) return "High";
  if (abs >= 5) return "Medium";
  return "Low";
};

/* ================= COMPONENT ================= */

export default function VarianceAlerts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [page, setPage] = useState(1);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= BUILD ALERTS (CORRECT LOGIC) ================= */

  const alerts: AlertRow[] = useMemo(() => {
    const endedShifts = shifts.filter(
      (s) =>
        s.status === "ended" &&
        s.openingSnapshot &&
        s.closingSnapshot
    );

    const rows: AlertRow[] = [];

    endedShifts.forEach((shift) => {
      products.forEach((product) => {
        const opening =
          shift.openingSnapshot?.find(
            (i: StockSnapshot) => i.sku === product.sku
          )?.quantity || 0;

        const closing =
          shift.closingSnapshot?.find(
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

        if (variance !== 0) {
          rows.push({
            sku: product.sku,
            product: product.name,
            unit: product.unit,
            shiftId: shift.id,
            shiftLabel: shift.label,
            date: shift.endedAt || "",
            variance,
            severity: severityFromVariance(variance),
          });
        }
      });
    });

    return rows;
  }, [shifts, products, logs]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(alerts.length / PAGE_SIZE)
  );
  const pageData = alerts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={18} />
          Variance Alerts
        </h2>
        <p className="text-sm text-gray-500">
          Confirmed stock discrepancies detected after shift closure.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-left">Shift</th>
              <th className="px-4 py-3 text-left">Severity</th>
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400"
                >
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

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Page {page} of {totalPages}
        </span>
        {/* Controls */}
  <div className="flex items-center gap-2 self-end sm:self-auto">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full
        bg-[#0F766E] text-white
        border border-[#0F766E]
        transition-all duration-200
        hover:bg-white hover:text-[#0F766E]
        focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
        disabled:bg-[#0F766E]/30
        disabled:border-[#0F766E]/30
        disabled:text-white/70
        disabled:cursor-not-allowed
      "
      aria-label="Previous page"
    >
      <ChevronLeft size={14} />
    </button>

    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full
        bg-[#0F766E] text-white
        border border-[#0F766E]
        transition-all duration-200
        hover:bg-white hover:text-[#0F766E]
        focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
        disabled:bg-[#0F766E]/30
        disabled:border-[#0F766E]/30
        disabled:text-white/70
        disabled:cursor-not-allowed
      "
      aria-label="Next page"
    >
      <ChevronRight size={14} />
    </button>
  </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function SeverityBadge({
  severity,
}: {
  severity: "High" | "Medium" | "Low";
}) {
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
