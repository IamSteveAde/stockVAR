"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info,
  Loader2,
} from "lucide-react";
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
import { getSession } from "@/lib/api/auth";
import { apiFetchFirstSuccess } from "@/lib/api/client";
import { unwrapData, ApiEnvelope, PaginationMeta } from "@/lib/api/response";
import { getReportsOverview, ReportRow } from "@/lib/api/reports";
import { listShifts, ShiftRecord } from "@/lib/api/shifts";
import type { ListProductsResponse } from "@/lib/api/stock";

/* ================= TYPES ================= */

type Product = {
  sku: string;
  name: string;
  unit: string;
};

type VarianceStatus = "negative" | "positive" | "perfect";

const VARIANCE_COLORS: Record<VarianceStatus, string> = {
  negative: "#DC2626",
  positive: "#FACC15",
  perfect: "#16A34A",
};

/* ================= HELPERS ================= */

function formatShiftLabel(shift: ShiftRecord) {
  const date = shift.date
    ? new Date(shift.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  return `${shift.name} • ${date}\nStaff: ${shift.staffResponsible || "Unknown"}`;
}

/* ================= COMPONENT ================= */

export default function OverviewReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [selectedVariance, setSelectedVariance] = useState<any>(null);
  const [openVariance, setOpenVariance] = useState(false);

  /* Filters */
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [draftShiftIds, setDraftShiftIds] = useState<string[]>([]);

  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [draftSkus, setDraftSkus] = useState<string[]>([]);

  const [openFilter, setOpenFilter] =
    useState<"shift" | "product" | null>(null);

  /* Pagination & Server Data */
  const [page, setPage] = useState(1);
  const [shiftPage, setShiftPage] = useState(1);
  const [hasMoreShifts, setHasMoreShifts] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [serverRows, setServerRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= LOAD FILTER OPTIONS ================= */

  useEffect(() => {
    let isMounted = true;
    const fetchFilters = async () => {
      try {
        const token = getSession()?.token;
        if (!token) return;

        const shiftsRes = await listShifts(token, 1, 10, "Ended");
        
        let allProducts: any[] = [];
        let pPage = 1;
        let pHasNext = true;
        while (pHasNext) {
          const res = await apiFetchFirstSuccess<ApiEnvelope<ListProductsResponse> | ListProductsResponse>(
            [`api/stock/product/list?page=${pPage}&type=active`],
            { token }
          );
          const data = unwrapData(res);
          allProducts = [...allProducts, ...(data.products || [])];
          if (data.meta.isLastPage) pHasNext = false;
          else pPage++;
        }

        if (isMounted) {
          const endedShifts = (shiftsRes.shifts || []).filter(s => s.status?.toLowerCase() === "ended");
          setShifts(endedShifts);
          setHasMoreShifts(!shiftsRes.meta?.isLastPage);
          setProducts(allProducts.map(p => ({ sku: p.uid, name: p.name, unit: p.unit })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
    return () => { isMounted = false; };
  }, []);

  const loadMoreShifts = async () => {
    if (!hasMoreShifts) return;
    try {
      const token = getSession()?.token;
      if (!token) return;
      const nextPage = shiftPage + 1;
      const res = await listShifts(token, nextPage, 50, "Ended");
      const ended = (res.shifts || []).filter(s => s.status?.toLowerCase() === "ended");
      setShifts(prev => [...prev, ...ended]);
      setHasMoreShifts(!res.meta?.isLastPage);
      setShiftPage(nextPage);
    } catch {}
  };

  /* ================= FETCH SERVER DATA ================= */

  useEffect(() => {
    let isMounted = true;
    const loadOverview = async () => {
      try {
        setIsLoading(true);
        const token = getSession()?.token;
        if (!token) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const res = await getReportsOverview(selectedSkus, selectedShiftIds, page, token);
        if (isMounted) {
          setServerRows(res.data || []);
          setTotalPages(res.meta?.pageCount || 1);
          setTotalCount(res.meta?.totalCount || 0);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadOverview();
    return () => { isMounted = false; };
  }, [selectedSkus, selectedShiftIds, page]);

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

  /* ================= BUILD GRAPH ================= */

  const varianceChartData = useMemo(() =>
    serverRows.map((r) => ({
      name: r.name,
      variance: r.variance,
      expected: r.expectedCount,
      actual: r.actualCount,
      unit: r.unit,
      status:
        r.variance === 0
          ? ("perfect" as VarianceStatus)
          : r.variance < 0
          ? ("negative" as VarianceStatus)
          : ("positive" as VarianceStatus),
    })),
  [serverRows]);



  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* ================= FILTER BAR ================= */}
<div className="bg-white rounded-xl shadow-sm p-4 space-y-4">

  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <div>
      <h3 className="text-sm font-semibold text-gray-900">
        Filter Results
      </h3>
      <p className="text-xs text-gray-500">
        Narrow down results by shift or product to find what matters faster.
      </p>
    </div>

    <span className="text-sm text-gray-500">
      {totalCount} item(s)
    </span>
  </div>

  {/* Filters */}
  <div className="flex flex-wrap gap-2 items-center">
    {/* Filter buttons */}
    <button
      onClick={() => {
        setDraftShiftIds(selectedShiftIds);
        setOpenFilter("shift");
      }}
      className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
    >
      Filter by Shifts
      <ChevronDown size={16} />
    </button>

    <button
      onClick={() => {
        setDraftSkus(selectedSkus);
        setOpenFilter("product");
      }}
      className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
    >
      Filter by Products
      <ChevronDown size={16} />
    </button>

    {/* Active filters */}
    {selectedShiftIds.length > 0 && (
      <button
        onClick={() => {
          setSelectedShiftIds([]);
          setPage(1);
        }}
        className="flex items-center gap-1 bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 px-3 py-1.5 rounded-lg text-sm transition hover:bg-[#0F766E]/20"
      >
        {selectedShiftIds.length} Shift{selectedShiftIds.length > 1 ? "s" : ""}
        <X size={14} className="ml-1 opacity-60" />
      </button>
    )}

    {selectedSkus.length > 0 && (
      <button
        onClick={() => {
          setSelectedSkus([]);
          setPage(1);
        }}
        className="flex items-center gap-1 bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 px-3 py-1.5 rounded-lg text-sm transition hover:bg-[#0F766E]/20"
      >
        {selectedSkus.length} Product{selectedSkus.length > 1 ? "s" : ""}
        <X size={14} className="ml-1 opacity-60" />
      </button>
    )}
  </div>
</div>
      {/* ================= SHIFT FILTER MODAL ================= */}
      {openFilter === "shift" && (
  <FilterModal
    title="Select shifts"
    items={shifts.filter((s) => s.status?.toLowerCase() === "ended")}
    getLabel={(s) => formatShiftLabel(s)}
    getId={(s) => s.uid}
    isActive={(s) => draftShiftIds.includes(s.uid)}
    onToggle={(s) =>
      setDraftShiftIds((p) =>
        p.includes(s.uid)
          ? p.filter((x) => x !== s.uid)
          : [...p, s.uid]
      )
    }
    onSelectAll={() =>
      setDraftShiftIds(
        shifts
          .filter((s) => s.status?.toLowerCase() === "ended")
          .map((s) => s.uid)
      )
    }
    onClear={() => setDraftShiftIds([])}
    onApply={applyShiftFilter}
    onClose={() => setOpenFilter(null)}
    onLoadMore={loadMoreShifts}
    externalHasMore={hasMoreShifts}
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
                onClick={(data: any) => {
                  setSelectedVariance(data);
                  setOpenVariance(true);
                }}
              >
             <LabelList
  dataKey="variance"
  position="inside"
  formatter={(value: any) =>
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

        {/* ===== TABLES ===== */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-[#0F766E]">
            <Loader2 className="animate-spin mr-2" size={24} />
            Loading overview...
          </div>
        ) : serverRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">No variance records found.</div>
        ) : (
          <>
            {/* ===== MOBILE VIEW ===== */}
            <div className="md:hidden divide-y">
              {serverRows.map((r, idx) => (
                <div key={r.name + idx} className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{r.name}</p>
                    <span className="text-xs text-gray-500">{r.unit}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Expected</p>
                      <p className="font-medium">{r.expectedCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Actual</p>
                      <p className="font-medium">{r.actualCount}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Variance</span>
                    <span className={`font-semibold ${r.variance < 0 ? "text-red-600" : r.variance > 0 ? "text-yellow-600" : "text-green-600"}`}>
                      {r.variance}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== ORIGINAL TABLE ===== */}
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
                  {serverRows.map((r, idx) => (
                    <tr key={r.name + idx} className="border-t">
                      <td className="px-6 py-4 font-medium">{r.name}</td>
                      <td className="px-6 py-4 text-right">{r.expectedCount}</td>
                      <td className="px-6 py-4 text-right">{r.actualCount}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${r.variance < 0 ? "text-red-600" : r.variance > 0 ? "text-yellow-600" : "text-green-600"}`}>
                        {r.variance}
                      </td>
                      <td className="px-6 py-4">{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

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
  onLoadMore,
  externalHasMore,
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
  onLoadMore?: () => void;
  externalHasMore?: boolean;
})


{
  const LIST_CHUNK_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(LIST_CHUNK_SIZE);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length || !!externalHasMore;

  useEffect(() => {
    setVisibleCount(LIST_CHUNK_SIZE);
  }, [items.length]);

  useEffect(() => {
    if (!hasMore) return;

    const root = listRef.current;
    const target = sentinelRef.current;

    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (visibleCount < items.length) {
            setVisibleCount((prev) =>
              Math.min(prev + LIST_CHUNK_SIZE, items.length)
            );
          } else if (onLoadMore && externalHasMore) {
            onLoadMore();
          }
        }
      },
      {
        root,
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, items.length]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-black">{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div ref={listRef} className="max-h-64 overflow-y-auto space-y-2">
          {visibleItems.map((item, i) => {
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

          {hasMore && (
            <div
              ref={sentinelRef}
              className="py-2 text-center text-xs text-gray-400"
            >
              Loading more...
            </div>
          )}
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
