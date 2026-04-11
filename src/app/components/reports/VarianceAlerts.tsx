"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getVarianceAlerts, VarianceAlertRow } from "@/lib/api/reports";
import { getSession } from "@/lib/api/auth";

/* ================= TYPES ================= */

type Severity = "High" | "Medium" | "Low";
type DateRange = "today" | "7d" | "1m" | "2m" | "custom";

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

/* ================= COMPONENT ================= */

export default function VarianceAlerts() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serverRows, setServerRows] = useState<VarianceAlertRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Filters ---------- */
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");

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
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const token = getSession()?.token;
        if (!token) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const { startDate, endDate } = getDateParams();
        const res = await getVarianceAlerts(
          startDate, 
          endDate, 
          search, 
          severity, 
          page, 
          PAGE_SIZE, 
          token
        );

        if (isMounted) {
          setServerRows(res.alert || []);
          setTotalPages(res.meta.pageCount || 1);
        }
      } catch (err) {
        console.error("Failed to fetch variance alerts", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const debounceHandle = setTimeout(fetchAlerts, 300); // Optional debounce for search
    return () => {
      isMounted = false;
      clearTimeout(debounceHandle);
    };
  }, [dateRange, fromDate, toDate, severity, search, page, getDateParams]);

  /* ================= UI ================= */

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={18} />
          Variance Alerts
        </h2>
        <p className="text-sm text-gray-500">
          Actionable stock discrepancies detected after shift closure.
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
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

        <select
          value={severity}
          onChange={(e) => {
            setPage(1);
            setSeverity(e.target.value as any);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          placeholder="Search product or SKU"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Item</th>
              <th className="px-4 py-3 text-center">Variance</th>
              <th className="px-4 py-3 text-center">Unit</th>
              <th className="px-4 py-3 text-center">Shift</th>
              <th className="px-4 py-3 text-center">Severity</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#0F766E]">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading alerts...</span>
                  </div>
                </td>
              </tr>
            ) : serverRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No variance alerts found
                </td>
              </tr>
            ) : (
              serverRows.map((v, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 text-center">
                    {new Date(v.date).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-center">{v.name}</td>
                  <td className="px-4 py-3 text-center text-red-600 font-semibold">
                    {v.variance}
                  </td>
                  <td className="px-4 py-3 text-center">{v.unit}</td>
                  <td className="px-4 py-3 text-center">{v.shift}</td>
                  <td className="px-4 py-3 text-center">
                    <SeverityBadge severity={v.severity as Severity} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-between items-center text-sm text-gray-500">
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
  );
}

/* ================= UI HELPERS ================= */

function SeverityBadge({ severity }: { severity: Severity | string }) {
  const sevKey = (severity || "").toLowerCase();
  
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const badgeClass = map[sevKey] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${badgeClass}`}
    >
      {severity || "Unknown"}
    </span>
  );
}
