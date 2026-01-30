"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
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

type Log = {
  sku: string;
  quantity: number;
  action: "in" | "out";
  shiftId: string;
};

type SnapshotItem = {
  sku: string;
  quantity: number;
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

/* ================= COMPONENT ================= */

export default function OverviewReport() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = () => {
      setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
      setShifts(JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]"));
      setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || "[]"));
    };

    load();
    window.addEventListener("stockvar:updated", load);

    return () =>
      window.removeEventListener("stockvar:updated", load);
  }, []);

  /* ================= BUILD VARIANCE ================= */

  const rows: Row[] = useMemo(() => {
    const endedShifts = shifts.filter(
      (s) =>
        s.status === "ended" &&
        s.openingSnapshot &&
        s.closingSnapshot
    );

    if (!endedShifts.length) return [];

    return products
      .map((p) => {
        let opening = 0;
        let added = 0;
        let used = 0;
        let actualLeft = 0;

        endedShifts.forEach((shift) => {
          const o = shift.openingSnapshot?.find(
            (i: SnapshotItem) => i.sku === p.sku
          );
          const c = shift.closingSnapshot?.find(
            (i: SnapshotItem) => i.sku === p.sku
          );

          opening += o?.quantity || 0;
          actualLeft += c?.quantity || 0;

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
      })
      .filter((r) => r.variance !== 0)
      .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
      .slice(0, 5); // dashboard limit
  }, [products, shifts, logs]);

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-sm my-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={18} />
          <h3 className="text-sm font-semibold text-black">
            Stock Variance Summary
          </h3>
        </div>

        <button
          onClick={() => router.push("/dashboard/reports")}
          className="text-sm text-[#0F766E] flex items-center gap-1 hover:underline"
        >
          View full report
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Content */}
      {rows.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 text-center">
          No stock variance recorded
        </div>
      ) : (
        <div className="divide-y">
          {rows.map((r) => (
            <div
              key={r.sku}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">
                  Expected {r.expectedLeft} • Actual {r.actualLeft}{" "}
                  {r.unit}
                </p>
              </div>

              <div
                className={`text-sm font-semibold ${
                  r.variance < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {r.variance}
                {r.unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
