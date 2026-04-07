"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type VarSummaryItem } from "@/lib/api/dashboard";

/* ================= COMPONENT ================= */

export default function OverviewReport({ data }: { data: VarSummaryItem[] }) {
  const router = useRouter();

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
      {!data || data.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 text-center">
          No stock variance recorded
        </div>
      ) : (
        <div className="divide-y">
          {data.map((r, idx) => (
            <div
              key={r.name || idx}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">
                  Expected {r.expectedCount} • Actual {r.actualCount}{" "}
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
