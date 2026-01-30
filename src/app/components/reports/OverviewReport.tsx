"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Shift } from "../shifts/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Cell, LabelList } from "recharts";


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

type Log = {
  sku: string;
  quantity: number;
  action: "in" | "out";
  shiftId: string;
};

type Row = {
  sku: string;
  name: string;
  unit: string;
  opening: number;
  added: number;
  used: number;
  expectedLeft: number;
  actualLeft: number;
  variance: number;
};


const PAGE_SIZE = 8;


/* ================= COMPONENT ================= */

export default function OverviewReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
  }, []);

  /* ================= FILTER ================= */

  const toggleShift = (id: string) => {
    setPage(1);
    setSelectedShiftIds((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setPage(1);
    setSelectedShiftIds(
      shifts.filter((s) => s.status === "ended").map((s) => s.id)
    );
  };

  const clearAll = () => {
    setPage(1);
    setSelectedShiftIds([]);
  };

  /* ================= BUILD REPORT ================= */

  const rows: Row[] = useMemo(() => {
    const endedShifts = shifts.filter(
      (s) =>
        selectedShiftIds.includes(s.id) &&
        s.status === "ended" &&
        s.openingSnapshot &&
        s.closingSnapshot
    );

    if (endedShifts.length === 0) return [];

    return products.map((p) => {
      let opening = 0;
      let added = 0;
      let used = 0;
      let actualLeft = 0;

      endedShifts.forEach((shift) => {
        const openingItem = shift.openingSnapshot?.find(
          (i) => i.sku === p.sku
        );
        const closingItem = shift.closingSnapshot?.find(
          (i) => i.sku === p.sku
        );

        opening += openingItem?.quantity || 0;
        actualLeft += closingItem?.quantity || 0;

        const shiftLogs = logs.filter(
          (l) => l.shiftId === shift.id && l.sku === p.sku
        );

        added += shiftLogs
          .filter((l) => l.action === "in")
          .reduce((s, l) => s + l.quantity, 0);

        used += shiftLogs
          .filter((l) => l.action === "out")
          .reduce((s, l) => s + l.quantity, 0);
      });

      const expectedLeft = opening + added - used;
      const variance = actualLeft - expectedLeft;

      return {
        sku: p.sku,
        name: p.name,
        unit: p.unit,
        opening,
        added,
        used,
        expectedLeft,
        actualLeft,
        variance,
      };
    });
  }, [selectedShiftIds, shifts, logs, products]);

  const varianceChartData = useMemo(() => {
  return rows.map((r) => ({
    name: r.name,
    variance: r.variance,
    isNegative: r.variance < 0,
  }));
}, [rows]);



  /* ================= PAGINATION ================= */

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const slice = rows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* ================= FILTER ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-full">
          <button
            onClick={() => setOpenFilter((o) => !o)}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm w-full sm:w-auto"
          >
            Filter by shift
            <ChevronDown size={16} />
          </button>

          {openFilter && (
            <div className="absolute left-0 z-20 mt-2 w-64 max-w-[90vw] bg-white border rounded-xl shadow-lg p-3 space-y-2">
              <div className="flex justify-between text-xs mb-2">
                <button onClick={selectAll} className="text-[#0F766E]">
                  Select all ended
                </button>
                <button onClick={clearAll} className="text-gray-500">
                  Clear
                </button>
              </div>

              {shifts
                .filter((s) => s.status === "ended")
                .map((s) => {
                  const active = selectedShiftIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleShift(s.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        active
                          ? "bg-[#0F766E]/10 text-[#0F766E]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        <span className="text-sm text-gray-500">
          {selectedShiftIds.length} shift(s) selected
        </span>
      </div>

      {/* ================= VARIANCE CHART ================= */}
{varianceChartData.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-sm font-medium text-gray-700 mb-4 text-black">
      Stock Variance by Item
    </h3>

    <ResponsiveContainer width="100%" height={320}>
  <BarChart data={varianceChartData}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      dataKey="name"
      tick={{ fontSize: 12 }}
      interval={0}
    />

    <YAxis
      tick={{ fontSize: 12 }}
      label={{
        value: "Variance (Actual − Expected)",
        angle: -90,
        position: "inside",
        style: { fontSize: 12, fill: "#6B7280" },
      }}
    />

    <ReferenceLine y={0} stroke="#000" />

    <Bar dataKey="variance" radius={[6, 6, 0, 0]}>
      {/* Value labels ON the bars */}
      <LabelList
  dataKey="variance"
  position="top"
  style={{ fontSize: 12, fill: "#374151" }}
/>


      {/* Dynamic colors */}
      {varianceChartData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.isNegative ? "#DC2626" : "#FACC15"}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

  </div>
)}


      {/* ================= MOBILE & TABLET (CARDS) ================= */}
      <div className="md:hidden space-y-3">
        {slice.map((r) => (
          <div
            key={r.sku}
            className="bg-white rounded-xl border p-4 space-y-2 w-full max-w-full"
          >
            <div className="flex justify-between items-start gap-2">
              <p className="font-medium truncate">{r.name}</p>
              <span
                className={`font-semibold shrink-0 ${
                  r.variance === 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {r.variance}
              </span>
            </div>

            <div className="grid grid-cols-2 text-xs text-gray-600 gap-y-1">
              <span>Opening: {r.opening}</span>
              <span>Added: +{r.added}</span>
              <span>Used: -{r.used}</span>
              <span>Expected: {r.expectedLeft}</span>
              <span>Actual: {r.actualLeft}</span>
              <span>Unit: {r.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Layers className="text-[#0F766E]" />
          <h3 className="font-medium text-[#0F766E]">Stock Variance Report</h3>
        </div>

        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-right">Opening</th>
              <th className="px-6 py-3 text-right">Added</th>
              <th className="px-6 py-3 text-right">Used</th>
              <th className="px-6 py-3 text-right">Expected</th>
              <th className="px-6 py-3 text-right">Actual</th>
              <th className="px-6 py-3 text-right">Variance</th>
              <th className="px-6 py-3 text-left">Unit</th>
            </tr>
          </thead>

          <tbody>
            {slice.map((r) => (
              <tr key={r.sku} className="border-t">
                <td className="px-6 py-4 font-medium truncate">
                  {r.name}
                </td>
                <td className="px-6 py-4 text-right">{r.opening}</td>
                <td className="px-6 py-4 text-right text-green-600">
                  +{r.added}
                </td>
                <td className="px-6 py-4 text-right text-red-600">
                  -{r.used}
                </td>
                <td className="px-6 py-4 text-right">
                  {r.expectedLeft}
                </td>
                <td className="px-6 py-4 text-right">
                  {r.actualLeft}
                </td>
                <td
                  className={`px-6 py-4 text-right font-semibold ${
                    r.variance === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.variance}
                </td>
                <td className="px-6 py-4">{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t">
  {/* Page info */}
  <span className="text-sm text-gray-500">
    Page <span className="font-medium text-gray-900">{page}</span> of{" "}
    <span className="font-medium text-gray-900">{totalPages}</span>
  </span>

  {/* Controls */}
  <div className="flex items-center gap-2 self-end sm:self-auto">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="
        inline-flex items-center justify-center
        h-10 w-10 rounded-full
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
      <ChevronLeft size={16} />
    </button>

    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="
        inline-flex items-center justify-center
        h-10 w-10 rounded-full
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
      <ChevronRight size={16} />
    </button>
  </div>
</div>

      </div>
    </div>
  );
}
