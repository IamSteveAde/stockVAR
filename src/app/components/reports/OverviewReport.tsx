"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Package,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

/* ================= MOCK DATA ================= */
const PRODUCTS = ["Rice", "Oil", "Chicken", "Tomatoes", "Milk"];

const VARIANCE = [
  { product: "Rice", qty: -12, unit: "kg", date: "2026-01-10" },
  { product: "Rice", qty: -6, unit: "kg", date: "2026-01-15" },
  { product: "Oil", qty: -4, unit: "L", date: "2026-01-18" },
  { product: "Chicken", qty: -9, unit: "pcs", date: "2026-01-20" },
];

const STOCK = Array.from({ length: 12 }).map((_, i) => ({
  product: PRODUCTS[i % PRODUCTS.length],
  opening: 120 - i * 3,
  used: 10 + i,
  closing: 110 - i * 4,
  unit: i % 2 === 0 ? "kg" : "pcs",
  date: `2026-01-${10 + i}`,
}));

/* ================= MAIN ================= */
export default function OverviewReport() {
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [range, setRange] = useState("7d");

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const stockPage = STOCK.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(STOCK.length / PAGE_SIZE);

  return (
    <div className="space-y-8 max-w-full">
      {/* ================= SUMMARY ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={AlertTriangle} label="Variance events" value="4" />
        <Summary icon={Package} label="Products affected" value="3" />
        <Summary icon={Layers} label="Most affected" value={product} />
        <Summary icon={Users} label="Staff involved" value="6" />
      </div>

      {/* ================= VARIANCE GRAPH ================= */}
      <Section title="Variance strength">
        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <select
            className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            {PRODUCTS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="1m">Last month</option>
            <option value="2m">Last 2 months</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Graph */}
        <div className="mt-4 h-40 sm:h-52 lg:h-64 rounded-lg bg-red-50 flex items-center justify-center text-sm text-black">
          Variance graph for {product}
        </div>
      </Section>

      {/* ================= STOCK ITEMS ================= */}
      <Section
        title="Stock items"
        actions={
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm"
            onClick={() => {}}
          >
            <Download size={16} /> Export CSV
          </button>
        }
      >
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-right font-medium">Opening</th>
                <th className="px-4 py-3 text-right font-medium">Used</th>
                <th className="px-4 py-3 text-right font-medium">Closing</th>
                <th className="px-4 py-3 text-left font-medium">Unit</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stockPage.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{s.product}</td>
                  <td className="px-4 py-3 text-right">{s.opening}</td>
                  <td className="px-4 py-3 text-right text-red-600 font-semibold">
                    {s.used}
                  </td>
                  <td className="px-4 py-3 text-right">{s.closing}</td>
                  <td className="px-4 py-3">{s.unit}</td>
                  <td className="px-4 py-3">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {stockPage.map((s, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{s.product}</span>
                <span className="text-xs text-gray-500">{s.date}</span>
              </div>
              <Row label="Opening" value={`${s.opening} ${s.unit}`} />
              <Row label="Used" value={`${s.used} ${s.unit}`} danger />
              <Row label="Closing" value={`${s.closing} ${s.unit}`} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-9 w-9 border rounded-lg flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-9 w-9 border rounded-lg flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function Section({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
      <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={danger ? "text-red-600 font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}