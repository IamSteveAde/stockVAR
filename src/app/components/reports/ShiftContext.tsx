"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, Filter, X, Package, Users, Loader2 } from "lucide-react";
import { getShiftContext, ShiftContextRow } from "@/lib/api/reports";
import { getSession } from "@/lib/api/auth";

type DateRange = "today" | "7d" | "1m" | "2m" | "custom";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ShiftContext() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serverRows, setServerRows] = useState<ShiftContextRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [range, setRange] = useState<DateRange>("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [active, setActive] = useState<ShiftContextRow | null>(null);

  const getDateParams = useCallback(() => {
    if (range === "custom") return { startDate: fromDate, endDate: toDate };

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (range === "today") {
      return { 
        startDate: today.toISOString().split("T")[0], 
        endDate: today.toISOString().split("T")[0] 
      };
    }

    const d = new Date();
    if (range === "7d") d.setDate(d.getDate() - 7);
    else if (range === "1m") d.setDate(d.getDate() - 30);
    else if (range === "2m") d.setDate(d.getDate() - 60);

    return {
      startDate: d.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    };
  }, [range, fromDate, toDate]);

  useEffect(() => {
    let isMounted = true;
    const fetchContext = async () => {
      try {
        setIsLoading(true);
        const token = getSession()?.token;
        if (!token) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const { startDate, endDate } = getDateParams();
        const res = await getShiftContext(startDate, endDate, page, token);

        if (isMounted) {
          setServerRows(res.context || []);
          setTotalPages(res.meta?.pageCount || 1);
        }
      } catch (err) {
        console.error("Failed to fetch shift context", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchContext();
    return () => { isMounted = false; };
  }, [range, fromDate, toDate, page, getDateParams]);

  /* ================= UI ================= */

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-[#0F766E]">
            Shift Context Report
          </h3>
          <p className="text-xs text-gray-500">
            Reconciliation of ended shifts with stock discrepancies
          </p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Filter size={14} /> Date range
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value as DateRange);
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="1m">Last 1 month</option>
              <option value="2m">Last 2 months</option>
              <option value="custom">Custom</option>
            </select>

            {range === "custom" && (
              <>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#0F766E]" size={24} />
            </div>
          )}

          {!isLoading && serverRows.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No discrepancies for selected period
            </div>
          )}

          {serverRows.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActive(s)}
              className="w-full p-4 text-left hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-medium">
                  {s.name} Shift
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(s.date)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <AlertTriangle size={14} />
                {s.itemsAffected || s.items.length} items affected
              </div>
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

      {/* ================= DETAIL MODAL ================= */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-xl">
            <div className="p-4 border-b flex justify-between">
              <h4 className="font-semibold">
                {active.name} – {formatDate(active.date)}
              </h4>
              <button onClick={() => setActive(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {active.items.map((i, idx) => {
                const variance = i.actual - i.expected;
                return (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={14} />
                        <span className="font-medium">
                          {i.name}
                        </span>
                      </div>

                      <span
                        className={`font-semibold ${
                          variance < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance}
                        {i.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                      <div>
                        <p className="text-gray-400">Opening</p>
                        <p>{i.opening}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Used</p>
                        <p>{i.used}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Expected</p>
                        <p>{i.expected}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Actual</p>
                        <p>{i.actual}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
