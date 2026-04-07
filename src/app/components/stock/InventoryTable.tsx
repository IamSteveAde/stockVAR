"use client";

import { useEffect, useState } from "react";
import AdjustInventoryModal from "./AdjustInventoryModal";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSession } from "@/lib/api/auth";
import { listInventory, adjustInventory as apiAdjustInventory } from "@/lib/api/stock";

/* ================= TYPES ================= */

type InventoryRow = {
  sku: string;
  name: string;
  unit: string;
  quantity: number;
  updatedAt: string;
  status: string;
};

/* ================= HELPERS ================= */

const now = () => new Date().toLocaleString();

/* ================= COMPONENT ================= */

export default function InventoryTable() {
  const PAGE_SIZE = 10;
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      const token = getSession()?.token;
      if (!token) return;

      try {
        const response: any = await listInventory(token, page, PAGE_SIZE);
        if (mounted && response && response.products) {
          const mapped = response.products.map((p: any) => ({
            sku: p.uid || p.sku,
            name: p.name,
            unit: p.unit,
            quantity: p.quantity || 0,
            updatedAt: p.updatedAt || now(),
            status: p.status || "active",
          }));
          setRows(mapped);
          setTotalPages(response.meta?.pageCount || 1);
          setTotalCount(response.meta?.totalCount || mapped.length);
        }
      } catch (err) {}
    };

    hydrate();
    return () => { mounted = false; };
  }, [page]);

  /* ================= ADJUST INVENTORY ================= */

  const adjustInventory = async (data: {
    sku: string;
    quantity: number;
    action: "add" | "reduce";
  }) => {
    const token = getSession()?.token;
    if (!token) throw new Error("Authentication required");

    await apiAdjustInventory(
      {
        productUid: data.sku,
        quantity: data.quantity,
        action: data.action,
      },
      token
    );

    setRows((prev) =>
      prev.map((i) =>
        i.sku === data.sku
          ? {
              ...i,
              quantity:
                data.action === "add"
                  ? i.quantity + data.quantity
                  : Math.max(0, i.quantity - data.quantity),
              updatedAt: now(),
            }
          : i
      )
    );
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-medium text-black">Inventory</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Adjust Inventory
        </button>
      </div>

      {/* ================= MOBILE & TABLET (CARDS) ================= */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">
            No inventory records yet
          </div>
        )}

        {rows.map((i, index) => (
          <div
            key={i.sku}
            className="bg-white rounded-xl border p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  #{index + 1}
                </p>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-gray-500 font-mono">
                  SKU: {i.sku}
                </p>
              </div>

              <span className="text-sm font-semibold">
                {i.quantity} {i.unit}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              Last updated: {i.updatedAt}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Unit</th>
              <th className="px-6 py-3 text-left">Updated</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No inventory records yet
                </td>
              </tr>
            )}

            {rows.map((i, index) => (
              <tr key={i.sku} className="border-t">
                <td className="px-6 py-4 text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium">
                  {i.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {i.sku}
                </td>
                <td className="px-6 py-4">
                  {i.quantity}
                </td>
                <td className="px-6 py-4">{i.unit}</td>
                <td className="px-6 py-4 text-gray-500">
                  {i.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-4 border-t bg-white rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-900">{page}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </p>

        <div className="w-full flex justify-center sm:justify-end">
          <div className="flex items-center gap-3">
            <button
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="
                h-10 w-10 flex items-center justify-center rounded-full
                bg-[#0F766E] text-white
                hover:bg-[#0d665f]
                focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F766E]
                transition
              "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              aria-label="Next page"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="
                h-10 w-10 flex items-center justify-center rounded-full
                bg-[#0F766E] text-white
                hover:bg-[#0d665f]
                focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F766E]
                transition
              "
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <AdjustInventoryModal
          products={rows.filter(
            (p) => p.status.toLowerCase() !== "archived"
          ) as any}
          onClose={() => setOpen(false)}
          onSave={adjustInventory}
        />
      )}
    </div>
  );
}
