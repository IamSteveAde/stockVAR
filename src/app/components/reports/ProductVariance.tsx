"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar,
} from "lucide-react";

/* ================= MOCK DATA ================= */
const rawData = [
  {
    product: "Rice",
    unit: "kg",
    variance: 10,
    date: "2026-08-02",
    shift: "Morning",
    staff: ["John", "Aisha"],
  },
  {
    product: "Ribce",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Ricet",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Ricse",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Ricce",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Ricex",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Ricew",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Rices",
    unit: "kg",
    variance: 6,
    date: "2026-08-05",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Oil",
    unit: "L",
    variance: 4,
    date: "2026-08-03",
    shift: "Morning",
    staff: ["Blessing"],
  },
  {
    product: "Oil",
    unit: "L",
    variance: 3,
    date: "2026-08-10",
    shift: "Night",
    staff: ["John", "Samuel"],
  },
  {
    product: "Chicken",
    unit: "pcs",
    variance: 9,
    date: "2026-08-06",
    shift: "Afternoon",
    staff: ["Aisha"],
  },
  {
    product: "Chicken",
    unit: "pcs",
    variance: 2,
    date: "2026-08-12",
    shift: "Night",
    staff: ["Samuel"],
  },
  {
    product: "Tomatoes",
    unit: "kg",
    variance: 5,
    date: "2026-08-11",
    shift: "Morning",
    staff: ["Blessing"],
  },
  {
    product: "Milk",
    unit: "L",
    variance: 7,
    date: "2026-08-04",
    shift: "Morning",
    staff: ["John"],
  },
];

/* ================= HELPERS ================= */
function subtractDays(from: string, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

/* ================= MAIN ================= */
export default function ProductVariance() {
  const [page, setPage] = useState(1);
  const [activeProduct, setActiveProduct] = useState<any>(null);

  const [dateRange, setDateRange] = useState("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const PAGE_SIZE = 10;

  /* Anchor presets to latest data date */
  const latestDate = useMemo(
    () => rawData.map((r) => r.date).sort().at(-1) || "",
    []
  );

  /* ================= DATE RANGE ================= */
  const computedRange = useMemo(() => {
    if (!latestDate) return { from: "", to: "" };

    if (dateRange === "today") {
      return { from: latestDate, to: latestDate };
    }
    if (dateRange === "7d") {
      return { from: subtractDays(latestDate, 7), to: latestDate };
    }
    if (dateRange === "1m") {
      return { from: subtractDays(latestDate, 30), to: latestDate };
    }
    if (dateRange === "2m") {
      return { from: subtractDays(latestDate, 60), to: latestDate };
    }
    if (dateRange === "custom") {
      return { from: fromDate, to: toDate };
    }
    return { from: "", to: "" };
  }, [dateRange, fromDate, toDate, latestDate]);

  /* ================= FILTER + AGGREGATE ================= */
  const aggregated = useMemo(() => {
    const filtered = rawData.filter((r) => {
      if (computedRange.from && r.date < computedRange.from) return false;
      if (computedRange.to && r.date > computedRange.to) return false;
      return true;
    });

    return Object.values(
      filtered.reduce((acc: any, cur) => {
        if (!acc[cur.product]) {
          acc[cur.product] = {
            product: cur.product,
            unit: cur.unit,
            totalVariance: 0,
            incidents: [],
            dates: [],
          };
        }
        acc[cur.product].totalVariance += cur.variance;
        acc[cur.product].incidents.push(cur);
        acc[cur.product].dates.push(cur.date);
        return acc;
      }, {})
    );
  }, [computedRange]);

  const totalPages = Math.ceil(aggregated.length / PAGE_SIZE);
  const pageData = aggregated.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b space-y-1">
          <h3 className="text-sm font-semibold text-black">
            Product Variance Summary
          </h3>
          <p className="text-xs text-gray-500">
            Aggregated variance by product and date
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
              className="border rounded-lg px-3 py-2 text-sm bg-white"
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
                  onChange={(e) => {
                    setPage(1);
                    setFromDate(e.target.value);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setPage(1);
                    setToDate(e.target.value);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y">
          {pageData.map((p: any) => (
            <button
              key={p.product}
              onClick={() => setActiveProduct(p)}
              className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{p.product}</p>
                <p className="text-xs text-gray-500">
                  {p.incidents.length} incidents •{" "}
                  {p.dates.sort()[0]} →{" "}
                  {p.dates.sort().at(-1)}
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
              {activeProduct.incidents.map(
                (i: any, idx: number) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">
                        {i.shift} shift
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
                        {i.staff.join(", ")}
                      </span>
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="p-4 border-t flex justify-between text-sm">
              <span className="text-gray-500">
                Total incidents:{" "}
                {activeProduct.incidents.length}
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
