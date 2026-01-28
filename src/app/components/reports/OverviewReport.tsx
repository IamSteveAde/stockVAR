"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Package,
  Users,
  Layers,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const PRODUCTS = [
  "Rice",
  "Oil",
  "Chicken",
  "Tomatoes",
  "Milk",
  "Beans",
  "Pepper",
  "Salt",
  "Sugar",
  "Garlic",
  "Onions",
  "Fish",
];

const VARIANCE_EVENTS = [
  { product: "Rice", qty: -12, unit: "kg", date: "2026-01-20" },
  { product: "Rice", qty: -4, unit: "kg", date: "2026-01-23" },
  { product: "Rice", qty: -7, unit: "kg", date: "2026-01-25" },
];

/* ---------------- STOCK ITEMS (REALISTIC VARIANCE) ---------------- */

const STOCK_ITEMS = PRODUCTS.map((p, i) => {
  const opening = 120 + i * 2;
  const used = 8 + i;

  const expectedClosing = opening - used;

  // Controlled realistic variance
  const variancePattern = [
    0,    // clean
    -3,   // small loss
    -12,  // big loss
    0,
    -6,
    0,
    -2,
    0,
    +2,   // suspicious (rare)
    -9,
    0,
    -4,
  ];

  const variance = variancePattern[i % variancePattern.length];

  return {
    product: p,
    opening,
    used,
    closing: expectedClosing + variance,
    unit:
      p === "Oil" || p === "Milk"
        ? "litres"
        : p === "Chicken" || p === "Fish"
        ? "pcs"
        : "kg",
    date: "2026-01-23",
  };
});

const PAGE_SIZE = 8;

/* ---------------- VARIANCE HELPER ---------------- */

const getVarianceMeta = (variance: number) => {
  if (variance === 0) {
    return { label: "0", className: "text-green-600 font-semibold" };
  }

  if (variance < 0) {
    return {
      label: variance.toString(),
      className: "text-red-600 font-semibold",
    };
  }

  // Positive variance = suspicious
  return {
    label: `+${variance}`,
    className: "text-red-700 font-bold",
  };
};

/* ====================================================== */

export default function OverviewReport() {
  const [variantRange, setVariantRange] = useState("7d");
  const [variantProduct, setVariantProduct] = useState("Rice");
  const [variantFrom, setVariantFrom] = useState("");
  const [variantTo, setVariantTo] = useState("");

  const [stockRange, setStockRange] = useState("7d");
  const [stockFrom, setStockFrom] = useState("");
  const [stockTo, setStockTo] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- HELPERS ---------------- */
  const inRange = (d: string, r: string, f?: string, t?: string) => {
    if (r !== "custom") return true;
    return (!f || d >= f) && (!t || d <= t);
  };

  /* ---------------- FILTERED DATA ---------------- */
  const filteredVariance = useMemo(
    () =>
      VARIANCE_EVENTS.filter(
        (v) =>
          v.product === variantProduct &&
          inRange(v.date, variantRange, variantFrom, variantTo)
      ),
    [variantProduct, variantRange, variantFrom, variantTo]
  );

  const filteredStock = useMemo(
    () =>
      STOCK_ITEMS.filter((s) =>
        inRange(s.date, stockRange, stockFrom, stockTo)
      ),
    [stockRange, stockFrom, stockTo]
  );

  const totalPages = Math.ceil(filteredStock.length / PAGE_SIZE);
  const stockSlice = filteredStock.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ---------------- EXPORT ---------------- */
  const exportCSV = () => {
    const rows = filteredStock.map((s) => {
      const expectedClosing = s.opening - s.used;
      const variance = s.closing - expectedClosing;

      return [
        s.product,
        s.opening,
        s.used,
        s.closing,
        variance,
        s.unit,
        s.date,
      ].join(",");
    });

    const csv =
      "Product,Opening,Used,Closing,Variance,Unit,Date\n" +
      rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-items.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          icon={AlertTriangle}
          label="Variance events"
          value={filteredVariance.length.toString()}
          danger
        />
        <SummaryCard
          icon={Package}
          label="Affected item"
          value={variantProduct}
          danger
        />
        <SummaryCard icon={Layers} label="Unit" value="kg" />
        <SummaryCard icon={Users} label="Staff involved" value="6" />
      </div>

      {/* ================= STOCK ITEMS ================= */}
      <Section
        title="Stock items"
        subtitle="Opening, usage, closing & variance"
        filter={
          <div className="flex flex-wrap gap-2">
            <DateSelect value={stockRange} onChange={setStockRange} />
            {stockRange === "custom" && (
              <DateInputs
                from={stockFrom}
                to={stockTo}
                setFrom={setStockFrom}
                setTo={setStockTo}
              />
            )}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm"
            >
              <Download size={16} /> CSV
            </button>
          </div>
        }
      >
        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-right font-medium">Opening</th>
                <th className="px-4 py-3 text-right font-medium">Used</th>
                <th className="px-4 py-3 text-right font-medium">Closing</th>
                <th className="px-4 py-3 text-right font-medium">Variance</th>
                <th className="px-4 py-3 text-left font-medium">Unit</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {stockSlice.map((s, i) => {
                const expectedClosing = s.opening - s.used;
                const variance = s.closing - expectedClosing;
                const meta = getVarianceMeta(variance);

                return (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.product}</td>
                    <td className="px-4 py-3 text-right">{s.opening}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-semibold">
                      {s.used}
                    </td>
                    <td className="px-4 py-3 text-right">{s.closing}</td>
                    <td className={`px-4 py-3 text-right ${meta.className}`}>
                      {meta.label}
                    </td>
                    <td className="px-4 py-3">{s.unit}</td>
                    <td className="px-4 py-3">{s.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-4 py-4 border-t text-sm text-gray-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-9 w-9 border rounded-lg flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 border rounded-lg flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, subtitle, filter, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium text-black">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        {filter}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function DateSelect({ value, onChange }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="today">Today</option>
      <option value="7d">Last 7 days</option>
      <option value="1m">Last 1 month</option>
      <option value="2m">Last 2 months</option>
      <option value="custom">Custom</option>
    </select>
  );
}

function DateInputs({ from, to, setFrom, setTo }: any) {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
      <Calendar size={16} />
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="outline-none"
      />
      <span>–</span>
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="outline-none"
      />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, danger }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-3 items-center">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center ${
          danger
            ? "bg-red-100 text-red-600"
            : "bg-[#0F766E]/10 text-[#0F766E]"
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
