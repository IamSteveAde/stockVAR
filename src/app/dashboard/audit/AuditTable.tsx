"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLog, normalizeAuditLog } from "../../../lib/audit";
import { getProfileAuditTrail } from "@/lib/api/profile";
import { getSession } from "@/lib/api/auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 12;

/* ================= COMPONENT ================= */

export default function AuditTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  /* Filters */
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* Pagination */
  const [page, setPage] = useState(1);

  /* ================= LOAD ================= */

  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      const token = getSession()?.token;
      if (!token) return;

      try {
        const response = await getProfileAuditTrail(token) as any;
        const trailArray = response?.trail || response;
        if (mounted && Array.isArray(trailArray)) {
          const parsed = trailArray
            .map(normalizeAuditLog)
            .filter((l): l is AuditLog => Boolean(l));
          setLogs(parsed);
        }
      } catch (err) {
        if (mounted) setLogs([]);
      }
    }

    loadLogs();
    
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const q = query.toLowerCase();

      const matchesQuery =
        !query ||
        log.actor.name.toLowerCase().includes(q) ||
        log.entity?.name?.toLowerCase().includes(q);

      const matchesAction =
        action === "all" || log.action === action;

      const created = new Date(log.createdAt).getTime();

      const matchesFrom =
        !fromDate ||
        created >= new Date(fromDate).getTime();

      const matchesTo =
        !toDate ||
        created <=
          new Date(toDate + "T23:59:59").getTime();

      return (
        matchesQuery &&
        matchesAction &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [logs, query, action, fromDate, toDate]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const start = (page - 1) * PAGE_SIZE;

  const current = filtered.slice(
    start,
    start + PAGE_SIZE
  );

  /* Reset page on filter change */
  useEffect(() => {
    setPage(1);
  }, [query, action, fromDate, toDate]);

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search staff or product…"
          className="border rounded-lg px-3 py-2 text-sm"
        />

        {/* Action */}
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All actions</option>
          <option value="PRODUCT_CREATE">
            Product created
          </option>
          <option value="PRODUCT_EDIT">
            Product edited
          </option>
          <option value="PRODUCT_ARCHIVE">
            Product archived
          </option>
          <option value="INVENTORY_ADJUST">
            Inventory adjusted
          </option>
          <option value="STOCK_IN">Stock in</option>
          <option value="STOCK_OUT">Stock out</option>
          <option value="SHIFT_START">
            Shift started
          </option>
          <option value="SHIFT_END">Shift ended</option>
        </select>

        {/* From */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        {/* To */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">
                Time
              </th>
              <th className="px-6 py-3 text-left">
                Staff
              </th>
              <th className="px-6 py-3 text-left">
                Action
              </th>
              <th className="px-6 py-3 text-left">
                Entity
              </th>
              <th className="px-6 py-3 text-left">
                Details
              </th>
              <th className="px-6 py-3 text-left">
                Shift
              </th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No matching audit records
                </td>
              </tr>
            )}

            {current.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-6 py-4 text-xs">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium">
                    {log.actor.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {log.actor.role}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                    {log.action.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium">
                    {log.entity?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {log.entity?.type}
                  </div>
                </td>

                <td className="px-6 py-4 text-xs">
                  {log.description}
                </td>

                <td className="px-6 py-4 text-xs">
                  {log.shift?.label || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-500">
          Page{" "}
          <span className="font-medium">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-medium">
            {totalPages}
          </span>
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 w-9 flex items-center justify-center rounded-full border disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 flex items-center justify-center rounded-full border disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
