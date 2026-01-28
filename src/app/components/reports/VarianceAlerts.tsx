"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= MOCK DATA ================= */
const alerts = Array.from({ length: 37 }).map((_, i) => ({
  date: `2026-08-${String((i % 28) + 1).padStart(2, "0")}`,
  product: ["Rice", "Oil", "Chicken", "Tomatoes"][i % 4],
  variance: `-${5 + (i % 12)}kg`,
  severity: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
  shift: i % 2 === 0 ? "Morning" : "Night",
  staff: ["John", "Aisha", "Samuel", "Blessing"].slice(0, (i % 3) + 1),
}));

/* ================= MAIN ================= */
export default function VarianceAlerts() {
  const [product, setProduct] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const filtered = alerts.filter((a) => {
    if (product !== "All" && a.product !== product) return false;
    if (severity !== "All" && a.severity !== severity) return false;

    if (fromDate && a.date < fromDate) return false;
    if (toDate && a.date > toDate) return false;

    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pageData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden space-y-6">
      {/* ================= HEADER ================= */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Variance Alerts</h2>
        <p className="text-sm text-gray-500">
          Logged inventory discrepancies detected across items, shifts, and staff.
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter size={16} />
          Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Item */}
          <select
            value={product}
            onChange={(e) => {
              setPage(1);
              setProduct(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option>All</option>
            <option>Rice</option>
            <option>Oil</option>
            <option>Chicken</option>
            <option>Tomatoes</option>
          </select>

          {/* Severity */}
          <select
            value={severity}
            onChange={(e) => {
              setPage(1);
              setSeverity(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* From Date */}
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setPage(1);
                setFromDate(e.target.value);
              }}
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setPage(1);
                setToDate(e.target.value);
              }}
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Shift</th>
              <th className="px-4 py-3 text-left">Staff Involved</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3 font-medium">{a.product}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {a.variance}
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={a.severity} />
                </td>
                <td className="px-4 py-3">{a.shift}</td>
                <td className="px-4 py-3 text-gray-600">
                  {a.staff.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {pageData.map((a, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{a.product}</p>
                <p className="text-xs text-gray-500">
                  {a.date} • {a.shift}
                </p>
              </div>
              <SeverityBadge severity={a.severity} />
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Variance</span>
              <span className="text-sm font-semibold text-red-600">
                {a.variance}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              Staff involved:{" "}
              <span className="text-gray-700">
                {a.staff.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-gray-500">
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
          {filtered.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="h-8 w-8 border rounded-md flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="h-8 w-8 border rounded-md flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function SeverityBadge({ severity }: { severity: string }) {
  const map: any = {
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
