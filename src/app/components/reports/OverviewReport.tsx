"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info,
} from "lucide-react";
import { Shift } from "../shifts/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  LabelList,
} from "recharts";

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
  const [draftShiftIds, setDraftShiftIds] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
    const s: Shift[] = JSON.parse(
      localStorage.getItem(SHIFTS_KEY) || "[]"
    );
    const l = JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");

    setProducts(p);
    setShifts(s);
    setLogs(l);

    // Default: most recent ended shift
    const latestEnded = s
      .filter((x) => x.status === "ended" && x.endedAt)
      .sort(
        (a, b) =>
          new Date(b.endedAt!).getTime() -
          new Date(a.endedAt!).getTime()
      )[0];

    if (latestEnded) {
      setSelectedShiftIds([latestEnded.id]);
    }
  }, []);

  /* ================= FILTER LOGIC ================= */

  const openFilterPanel = () => {
    setDraftShiftIds(selectedShiftIds);
    setOpenFilter(true);
  };

  const toggleDraft = (id: string) => {
    setDraftShiftIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const applyFilter = () => {
    setSelectedShiftIds(draftShiftIds);
    setPage(1);
    setOpenFilter(false);
  };

  const clearFilter = () => {
    setDraftShiftIds([]);
  };

  /* ================= BUILD REPORT ================= */

  const rows: Row[] = useMemo(() => {
    const ended = shifts.filter(
      (s) =>
        selectedShiftIds.includes(s.id) &&
        s.status === "ended" &&
        s.openingSnapshot &&
        s.closingSnapshot
    );

    if (!ended.length) return [];

    return products.map((p) => {
      let opening = 0;
      let added = 0;
      let used = 0;
      let actualLeft = 0;

      ended.forEach((shift) => {
        opening +=
          shift.openingSnapshot!.find(
            (i) => i.sku === p.sku
          )?.quantity || 0;

        actualLeft +=
          shift.closingSnapshot!.find(
            (i) => i.sku === p.sku
          )?.quantity || 0;

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

      return {
        sku: p.sku,
        name: p.name,
        unit: p.unit,
        opening,
        added,
        used,
        expectedLeft,
        actualLeft,
        variance: actualLeft - expectedLeft,
      };
    });
  }, [selectedShiftIds, shifts, logs, products]);

  const varianceChartData = useMemo(
    () =>
      rows.map((r) => ({
        name: r.name,
        variance: r.variance,
        isNegative: r.variance < 0,
      })),
    [rows]
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / PAGE_SIZE)
  );
  const slice = rows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={openFilterPanel}
          className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm"
        >
          Filter by shift
          <ChevronDown size={16} />
        </button>

        <span className="text-sm text-gray-500">
          {selectedShiftIds.length} shift(s) selected
        </span>
      </div>

      {/* ================= FILTER MODAL ================= */}
      {openFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Select shifts</h3>
              <button onClick={() => setOpenFilter(false)}>
                <X />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {shifts
                .filter((s) => s.status === "ended")
                .map((s) => {
                  const active = draftShiftIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleDraft(s.id)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
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

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={clearFilter}
                className="text-sm text-gray-500"
              >
                Clear
              </button>
              <button
                onClick={applyFilter}
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
              >
                Apply filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VARIANCE CHART + EXPLANATION ================= */}
      {varianceChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          {/* Explanation */}
          <div className="flex items-start gap-3 bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-lg p-4">
            <Info className="text-[#0F766E] mt-0.5" size={18} />
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium text-[#0F766E]">
                How to read this chart
              </p>
              <p>
                This chart shows the difference between the
                <strong> expected stock</strong> and the
                <strong> actual counted stock</strong> at
                the end of selected shifts.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                <li>
                  <strong>Yellow bars</strong> indicate more
                  stock than expected (positive variance).
                </li>
                <li>
                  <strong>Red bars</strong> indicate missing
                  stock (negative variance).
                </li>
                <li>
                  The horizontal zero line represents
                  perfect stock accuracy.
                </li>
              </ul>
              <p className="text-xs text-gray-500">
                Large negative variances should be reviewed
                for shrinkage, wastage, or recording errors.
              </p>
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Stock Variance by Item
            </h3>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={varianceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} />
                <YAxis />
                <ReferenceLine y={0} stroke="#000" />

                <Bar dataKey="variance" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="variance"
                    position="top"
                    fontSize={12}
                  />
                  {varianceChartData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.isNegative
                          ? "#DC2626"
                          : "#FACC15"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {slice.map((r) => (
          <div
            key={r.sku}
            className="bg-white rounded-xl border p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-medium truncate">{r.name}</p>
              <span
                className={`font-semibold ${
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
          <h3 className="font-medium text-[#0F766E]">
            Stock Variance Report
          </h3>
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
                <td className="px-6 py-4 font-medium">
                  {r.name}
                </td>
                <td className="px-6 py-4 text-right">
                  {r.opening}
                </td>
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
        <div className="flex justify-between items-center px-6 py-4 border-t text-sm">
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
    </div>
  );
}
