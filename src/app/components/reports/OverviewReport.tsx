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

type VarianceStatus = "negative" | "positive" | "perfect";

const PAGE_SIZE = 8;

const VARIANCE_COLORS: Record<VarianceStatus, string> = {
  negative: "#DC2626",
  positive: "#FACC15",
  perfect: "#16A34A",
};



/* ================= HELPERS ================= */

function formatShiftLabel(shift: Shift) {
  const date = shift.endedAt
    ? new Date(shift.endedAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const staff =
    shift.staff?.length > 0
      ? shift.staff.map((s) => s.fullName).join(", ")
      : "No staff";

  return `${shift.label} • ${date}\nStaff: ${staff}`;
}


/* ================= COMPONENT ================= */

export default function OverviewReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedVariance, setSelectedVariance] = useState<any>(null);
  const [openVariance, setOpenVariance] = useState(false);


  /* Filters */
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [draftShiftIds, setDraftShiftIds] = useState<string[]>([]);

  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [draftSkus, setDraftSkus] = useState<string[]>([]);

  const [openFilter, setOpenFilter] =
    useState<"shift" | "product" | null>(null);

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

    // Default → most recent ended shift
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

  /* ================= APPLY FILTERS ================= */

  const applyShiftFilter = () => {
    setSelectedShiftIds(draftShiftIds);
    setPage(1);
    setOpenFilter(null);
  };

  const applyProductFilter = () => {
    setSelectedSkus(draftSkus);
    setPage(1);
    setOpenFilter(null);
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

    if (!endedShifts.length) return [];

    const visibleProducts =
      selectedSkus.length === 0
        ? products
        : products.filter((p) =>
            selectedSkus.includes(p.sku)
          );

    return visibleProducts.map((p) => {
      let opening = 0;
      let added = 0;
      let used = 0;
      let actualLeft = 0;

      endedShifts.forEach((shift) => {
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
  }, [selectedShiftIds, selectedSkus, shifts, logs, products]);

  const varianceChartData = useMemo(
  () =>
    rows.map((r) => ({
      name: r.name,
      variance: r.variance,
      expected: r.expectedLeft,
      actual: r.actualLeft,
      unit: r.unit,
      status:
        r.variance === 0
          ? ("perfect" as VarianceStatus)
          : r.variance < 0
          ? ("negative" as VarianceStatus)
          : ("positive" as VarianceStatus),
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
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDraftShiftIds(selectedShiftIds);
              setOpenFilter("shift");
            }}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm"
          >
            Shifts
            <ChevronDown size={16} />
          </button>

          <button
            onClick={() => {
              setDraftSkus(selectedSkus);
              setOpenFilter("product");
            }}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm"
          >
            Products
            <ChevronDown size={16} />
          </button>
        </div>

        <span className="text-sm text-gray-500">
          {rows.length} item(s)
        </span>
      </div>

      {/* ================= SHIFT FILTER MODAL ================= */}
      {openFilter === "shift" && (
  <FilterModal
    title="Select shifts"
    items={shifts.filter((s) => s.status === "ended")}
    getLabel={(s) => formatShiftLabel(s)}
    getId={(s) => s.id}
    isActive={(s) => draftShiftIds.includes(s.id)}
    onToggle={(s) =>
      setDraftShiftIds((p) =>
        p.includes(s.id)
          ? p.filter((x) => x !== s.id)
          : [...p, s.id]
      )
    }
    onSelectAll={() =>
      setDraftShiftIds(
        shifts
          .filter((s) => s.status === "ended")
          .map((s) => s.id)
      )
    }
    onClear={() => setDraftShiftIds([])}
    onApply={applyShiftFilter}
    onClose={() => setOpenFilter(null)}
  />
)}

      {/* ================= PRODUCT FILTER MODAL ================= */}
      {openFilter === "product" && (
  <FilterModal
    title="Select products"
    items={products}
    getLabel={(p) => p.name}
    getId={(p) => p.sku}
    isActive={(p) => draftSkus.includes(p.sku)}
    onToggle={(p) =>
      setDraftSkus((s) =>
        s.includes(p.sku)
          ? s.filter((x) => x !== p.sku)
          : [...s, p.sku]
      )
    }
    onSelectAll={() =>
      setDraftSkus(products.map((p) => p.sku))
    }
    onClear={() => setDraftSkus([])}
    onApply={applyProductFilter}
    onClose={() => setOpenFilter(null)}
  />
)}

      {/* ================= CHART + EXPLANATION ================= */}
      {varianceChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-start gap-3 bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-lg p-4">
            <Info className="text-[#0F766E] mt-0.5" size={18} />
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium text-[#0F766E]">
                How to read this chart
              </p>
              <p>
                This chart compares expected stock versus
                physically counted stock at the end of
                each selected shift date.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                <li>
                  <strong>Yellow</strong> = surplus stock
                </li>
                <li>
                  <strong>Red</strong> = missing stock
                </li>
                <li>
                  <strong>Zero-line/Green</strong> = perfect accuracy
                </li>
              </ul>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={varianceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis
                label={{
                  value: "Variance (Actual − Expected)",
                  angle: -90,
                  position: "inside",
                }}
              />
              <ReferenceLine y={0} stroke="#000" />
              <Bar
                dataKey="variance"
                radius={[6, 6, 0, 0]}
                minPointSize={6}
                cursor="pointer"
                onClick={(data) => {
                  setSelectedVariance(data);
                  setOpenVariance(true);
                }}
              >
             <LabelList
  dataKey="variance"
  position="inside"
  formatter={(value) =>
    typeof value === "number" ? value : ""
  }
  style={{
    fill: "#fff",
    fontWeight: 600,
    fontSize: 12,
  }}
/>

                {varianceChartData.map((d, i) => (
  <Cell
    key={i}
    fill={VARIANCE_COLORS[d.status]}
  />
))}

              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {openVariance && selectedVariance && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-green-700">
          {selectedVariance.name}
        </h3>
        <button onClick={() => setOpenVariance(false)}>
          <X />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Expected</p>
          <p className="font-semibold">
            {selectedVariance.expected}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Actual</p>
          <p className="font-semibold">
            {selectedVariance.actual}
          </p>
        </div>
      </div>

      <div
        className={`rounded-lg px-4 py-3 text-sm font-medium ${
          selectedVariance.status === "perfect"
            ? "bg-green-50 text-green-700"
            : selectedVariance.status === "negative"
            ? "bg-red-50 text-red-700"
            : "bg-yellow-50 text-yellow-700"
        }`}
      >
        Variance: {selectedVariance.variance} {selectedVariance.unit}
      </div>
    </div>
  </div>
)}


      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Layers className="text-[#0F766E]" />
          <h3 className="font-medium text-[#0F766E]">
            Stock Variance Report
          </h3>
        </div>

        {/* ===== MOBILE VIEW (NO LOGIC CHANGE) ===== */}
        <div className="md:hidden divide-y">
          {slice.map((r) => (
            <div key={r.sku} className="p-4 space-y-3">
              <div className="flex justify-between">
                <p className="font-medium">{r.name}</p>
                <span className="text-xs text-gray-500">{r.unit}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Expected</p>
                  <p className="font-medium">{r.expectedLeft}</p>
                </div>
                <div>
                  <p className="text-gray-500">Actual</p>
                  <p className="font-medium">{r.actualLeft}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Variance</span>
                <span className="font-semibold text-red-600">
                  {r.variance}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== ORIGINAL TABLE (UNCHANGED) ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-right">Expected</th>
                <th className="px-6 py-3 text-right">Actual</th>
                <th className="px-6 py-3 text-right">Variance</th>
                <th className="px-6 py-3 text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((r) => (
                <tr key={r.sku} className="border-t">
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4 text-right">{r.expectedLeft}</td>
                  <td className="px-6 py-4 text-right">{r.actualLeft}</td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600">
                    {r.variance}
                  </td>
                  <td className="px-6 py-4">{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

/* ================= FILTER MODAL ================= */

function FilterModal<T>({
  title,
  items,
  getLabel,
  getId,
  isActive,
  onToggle,
  onApply,
  onClear,
  onSelectAll,
  onClose,
}: {
  title: string;
  items: T[];
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  isActive: (item: T) => boolean;
  onToggle: (item: T) => void;
  onApply: () => void;
  onClear: () => void;
  onSelectAll: () => void;
  onClose: () => void;
})


{
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-black">{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {items.map((item, i) => {
            const active = isActive(item);
            return (
              <button
                key={i}
                onClick={() => onToggle(item)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-[#0F766E]/10 text-[#0F766E]"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{getLabel(item)}</span>
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
  <div className="flex gap-3">
    <button
      onClick={onSelectAll}
      className="text-sm text-[#0F766E] font-medium"
    >
      Select all
    </button>

    <button
      onClick={onClear}
      className="text-sm text-gray-500"
    >
      Clear
    </button>
  </div>

  <button
    onClick={onApply}
    className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
  >
    Apply
  </button>
</div>

      </div>
    </div>
  );
}
