"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Package,
} from "lucide-react";

/* ================= MOCK DATA ================= */
const shifts = [
  {
    date: "2026-08-12",
    shift: "Night",
    staff: ["John", "Aisha", "Samuel"],
    items: [
      { product: "Rice", unit: "kg", variance: 6 },
      { product: "Oil", unit: "L", variance: 2 },
    ],
  },
  {
    date: "2026-08-11",
    shift: "Morning",
    staff: ["Blessing", "John"],
    items: [
      { product: "Tomatoes", unit: "kg", variance: 5 },
    ],
  },
  {
    date: "2026-08-10",
    shift: "Afternoon",
    staff: ["Samuel", "Aisha"],
    items: [
      { product: "Chicken", unit: "pcs", variance: 3 },
      { product: "Eggs", unit: "pcs", variance: 6 },
    ],
  },
  {
    date: "2026-08-09",
    shift: "Night",
    staff: ["John"],
    items: [
      { product: "Rice", unit: "kg", variance: 4 },
    ],
  },
  {
    date: "2026-08-08",
    shift: "Morning",
    staff: ["Blessing", "Samuel"],
    items: [
      { product: "Milk", unit: "L", variance: 3 },
    ],
  },
  {
    date: "2026-08-07",
    shift: "Night",
    staff: ["Aisha", "John"],
    items: [
      { product: "Oil", unit: "L", variance: 4 },
      { product: "Rice", unit: "kg", variance: 2 },
    ],
  },
];

/* ================= HELPERS ================= */
function subtractDays(from: string, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

/* ================= MAIN ================= */
export default function ShiftContext() {
  const [dateRange, setDateRange] = useState("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [activeShift, setActiveShift] = useState<any>(null);

  const PAGE_SIZE = 3;

  /* Anchor presets to latest data date */
  const latestDate = useMemo(
    () => shifts.map((s) => s.date).sort().at(-1) || "",
    []
  );

  /* ================= DATE RANGE ================= */
  const computedRange = useMemo(() => {
    if (!latestDate) return { from: "", to: "" };

    switch (dateRange) {
      case "today":
        return { from: latestDate, to: latestDate };
      case "7d":
        return { from: subtractDays(latestDate, 7), to: latestDate };
      case "1m":
        return { from: subtractDays(latestDate, 30), to: latestDate };
      case "2m":
        return { from: subtractDays(latestDate, 60), to: latestDate };
      case "custom":
        return { from: fromDate, to: toDate };
      default:
        return { from: "", to: "" };
    }
  }, [dateRange, fromDate, toDate, latestDate]);

  /* ================= FILTER ================= */
  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      if (computedRange.from && s.date < computedRange.from) return false;
      if (computedRange.to && s.date > computedRange.to) return false;
      return true;
    });
  }, [computedRange]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredShifts.length / PAGE_SIZE);
  const pageData = filteredShifts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b space-y-1">
          <h3 className="text-sm font-semibold text-black">Shift Variance Context</h3>
          <p className="text-xs text-gray-500">
            Click a shift to view missing items and quantities
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
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y">
          {pageData.map((s, i) => {
            const incidentCount = s.items.length;
            return (
              <button
                key={`${s.date}-${s.shift}`}
                onClick={() => setActiveShift(s)}
                className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {s.shift} Shift
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {s.date}
                  </p>
                </div>

                <div className="text-xs text-gray-600">
                  Staff:{" "}
                  <span className="text-gray-800">
                    {s.staff.join(", ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertTriangle size={14} />
                  {incidentCount} items affected
                </div>
              </button>
            );
          })}

          {pageData.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No shift variance records for selected period
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filteredShifts.length)} of{" "}
            {filteredShifts.length}
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
          <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-black">
                  {activeShift.shift} Shift – {activeShift.date}
                </h4>
                <p className="text-xs text-gray-500">
                  Missing items and quantities
                </p>
              </div>
              <button
                onClick={() => setActiveShift(null)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
              {activeShift.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span className="font-medium">
                      {item.product}
                    </span>
                  </div>

                  <span className="font-semibold text-red-600">
                    -{item.variance}
                    {item.unit}
                  </span>
                </div>
              ))}

              <div className="text-xs text-gray-500 pt-2">
                Staff on duty:{" "}
                <span className="text-gray-700">
                  {activeShift.staff.join(", ")}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-between text-sm">
              <span className="text-gray-500">
                Total items affected: {activeShift.items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
