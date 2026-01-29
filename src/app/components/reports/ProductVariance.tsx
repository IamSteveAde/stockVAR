"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
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

type Incident = {
  date: string;
  shiftLabel: string;
  variance: number;
  unit: string;
  staff: string[];
};

type AggregatedProduct = {
  sku: string;
  product: string;
  unit: string;
  totalVariance: number;
  incidents: Incident[];
  dates: number[];
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

/* ================= MAIN ================= */

export default function ProductVariance() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  const [page, setPage] = useState(1);
  const [activeProduct, setActiveProduct] =
    useState<AggregatedProduct | null>(null);

  const [dateRange, setDateRange] = useState("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= LATEST ENDED SHIFT ================= */

  const latestEndedTs = useMemo(() => {
    const ended = shifts
      .filter((s) => s.status === "ended" && s.endedAt)
      .map((s) => new Date(s.endedAt!).getTime());

    return ended.length ? Math.max(...ended) : null;
  }, [shifts]);

  /* ================= DATE BOUNDS ================= */

  const dateBounds = useMemo(() => {
    if (!latestEndedTs) return null;

    let fromTs = 0;
    let toTs = latestEndedTs;

    if (dateRange === "today") {
      const d = new Date(latestEndedTs);
      d.setHours(0, 0, 0, 0);
      fromTs = d.getTime();
    }

    if (dateRange === "7d") {
      fromTs = latestEndedTs - 7 * 24 * 60 * 60 * 1000;
    }

    if (dateRange === "1m") {
      fromTs = latestEndedTs - 30 * 24 * 60 * 60 * 1000;
    }

    if (dateRange === "2m") {
      fromTs = latestEndedTs - 60 * 24 * 60 * 60 * 1000;
    }

    if (dateRange === "custom") {
      if (!fromDate || !toDate) return null;
      fromTs = new Date(fromDate + "T00:00:00").getTime();
      toTs = new Date(toDate + "T23:59:59").getTime();
    }

    return { fromTs, toTs };
  }, [dateRange, fromDate, toDate, latestEndedTs]);

  /* ================= AGGREGATE VARIANCE ================= */

  const aggregated: AggregatedProduct[] = useMemo(() => {
    const acc: Record<string, AggregatedProduct> = {};

    const endedShifts = shifts.filter(
      (s) =>
        s.status === "ended" &&
        s.openingSnapshot &&
        s.closingSnapshot &&
        s.endedAt
    );

    endedShifts.forEach((shift) => {
      const endedTs = new Date(shift.endedAt!).getTime();

      if (dateBounds) {
        if (endedTs < dateBounds.fromTs) return;
        if (endedTs > dateBounds.toTs) return;
      }

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

        if (variance >= 0) return; // only losses

        if (!acc[product.sku]) {
          acc[product.sku] = {
            sku: product.sku,
            product: product.name,
            unit: product.unit,
            totalVariance: 0,
            incidents: [],
            dates: [],
          };
        }

        acc[product.sku].totalVariance += Math.abs(variance);
        acc[product.sku].dates.push(endedTs);

        acc[product.sku].incidents.push({
          date: shift.endedAt!,
          shiftLabel: shift.label,
          variance: Math.abs(variance),
          unit: product.unit,
          staff: shift.staff?.map((s) => s.fullName) || [],
        });
      });
    });

    return Object.values(acc);
  }, [shifts, products, logs, dateBounds]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(aggregated.length / PAGE_SIZE)
  );

  const pageData = aggregated.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b space-y-1">
          <h3 className="text-sm font-semibold">
            Product Variance Summary
          </h3>
          <p className="text-xs text-gray-500">
            Confirmed stock losses aggregated by product
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
                setPage(1);
                setDateRange(e.target.value);
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
          {pageData.length === 0 && (
            <p className="p-6 text-sm text-gray-400 text-center">
              No product variance found for this period
            </p>
          )}

          {pageData.map((p) => (
            <button
              key={p.sku}
              onClick={() => setActiveProduct(p)}
              className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{p.product}</p>
                <p className="text-xs text-gray-500">
                  {p.incidents.length} incidents •{" "}
                  {new Date(Math.min(...p.dates))
                    .toISOString()
                    .split("T")[0]}{" "}
                  →{" "}
                  {new Date(Math.max(...p.dates))
                    .toISOString()
                    .split("T")[0]}
                </p>
              </div>

              <p className="font-semibold text-red-600">
                -{p.totalVariance}
                {p.unit}
              </p>
            </button>
          ))}
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
      {activeProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">
                {activeProduct.product} – Variance Details
              </h4>
              <button
                onClick={() => setActiveProduct(null)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeProduct.incidents.map((i, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">
                      {i.shiftLabel} shift
                    </span>
                    <span className="font-semibold text-red-600">
                      -{i.variance}
                      {i.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Date: {i.date}
                  </p>
                  <p className="text-xs text-gray-500">
                    Staff:{" "}
                    <span className="text-gray-700">
                      {i.staff.join(", ") || "—"}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex justify-between text-sm">
              <span className="text-gray-500">
                Total incidents: {activeProduct.incidents.length}
              </span>
              <span className="font-semibold text-red-600">
                Total variance: -{activeProduct.totalVariance}
                {activeProduct.unit}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
