"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Filter, X, Loader2 } from "lucide-react";
import { getProductVariance, ProductVarianceRow } from "@/lib/api/reports";
import { getSession } from "@/lib/api/auth";

/* ================= TYPES ================= */

type DateRange = "today" | "7d" | "1m" | "2m" | "custom";

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

/* ================= SAFE DATE ================= */

function safeDate(ts?: number | string) {
  if (!ts) return "—";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().split("T")[0];
}

/* ================= MAIN ================= */

export default function ProductVariance() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serverRows, setServerRows] = useState<ProductVarianceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeProduct, setActiveProduct] = useState<ProductVarianceRow | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getDateParams = useCallback(() => {
    if (dateRange === "custom") return { startDate: fromDate, endDate: toDate };

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRange === "today") {
      return { 
        startDate: today.toISOString().split("T")[0], 
        endDate: today.toISOString().split("T")[0] 
      };
    }

    const d = new Date();
    if (dateRange === "7d") d.setDate(d.getDate() - 7);
    else if (dateRange === "1m") d.setDate(d.getDate() - 30);
    else if (dateRange === "2m") d.setDate(d.getDate() - 60);

    return {
      startDate: d.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    };
  }, [dateRange, fromDate, toDate]);

  /* ================= FETCH SERVER DATA ================= */

  useEffect(() => {
    let isMounted = true;
    const fetchVariance = async () => {
      try {
        setIsLoading(true);
        const token = getSession()?.token;
        if (!token) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const { startDate, endDate } = getDateParams();
        const res = await getProductVariance(
          startDate, 
          endDate, 
          page, 
          PAGE_SIZE, 
          token
        );

        if (isMounted) {
          setServerRows(res.pv || []);
          setTotalPages(res.meta?.pageCount || 1);
        }
      } catch (err) {
        console.error("Failed to fetch product variance", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchVariance();
    return () => { isMounted = false; };
  }, [dateRange, fromDate, toDate, page, getDateParams]);

  /* ================= UI ================= */

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-[#0F766E]">
            Product Variance Summary
          </h3>
          <p className="text-xs text-gray-500">
            Confirmed stock losses aggregated by product
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
                setPage(1);
                setDateRange(e.target.value as DateRange);
              }}
              className="border rounded-lg px-3 py-2 text-sm"
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
            <p className="p-6 text-sm text-gray-400 text-center">
              No product variance found
            </p>
          )}

          {serverRows.map((p) => {
            const dates = p.variance.map((v) => new Date(v.createdAt).getTime()).filter((t) => !Number.isNaN(t));
            const totalVariance = p.variance.reduce((sum, v) => sum + Math.abs(v.variance), 0);

            return (
              <button
                key={p.name}
                onClick={() => setActiveProduct(p)}
                className="w-full text-left p-4 flex justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.variance.length} incidents{dates.length > 0 ? " • " : ""}
                    {dates.length > 0 && `${safeDate(Math.min(...dates))} → ${safeDate(Math.max(...dates))}`}
                  </p>
                </div>
                <p className="font-semibold text-red-600">
                  -{totalVariance}
                </p>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between text-xs text-gray-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full
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
      <ChevronLeft size={14} />
    </button>

    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full
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
      <ChevronRight size={14} />
    </button>
  </div>
        </div>
      </div>

      {/* Modal */}
      {activeProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex justify-between p-4 border-b">
              <h4 className="font-semibold">
                {activeProduct.name} – Variance Details
              </h4>
              <button onClick={() => setActiveProduct(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {activeProduct.variance.map((i, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm text-gray-600" title={i.shiftUid}>
                      Shift Record #{i.id}
                    </span>
                    <span className="font-semibold text-red-600">
                      -{Math.abs(i.variance)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected: {i.expectedCount} | Actual: {i.actualCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {new Date(i.createdAt).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Linked Staff: {i.linkedStaffCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
