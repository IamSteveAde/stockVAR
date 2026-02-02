"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Shift, StockSnapshot, Staff } from "./types";

/* ================= TYPES ================= */

type InventoryItem = {
  sku: string;
  quantity: number; // system quantity (NOT shown)
};

type Product = {
  sku: string;
  name: string;
};

const PRODUCTS_KEY = "stockvar_products";


type Props = {
  shift: Shift;
  inventory: InventoryItem[];
  onCancel: () => void;
  onConfirm?: (closingSnapshot: StockSnapshot[]) => void; // optional
};

/* ================= COMPONENT ================= */

export default function CloseShiftModal({
  shift,
  inventory,
  onCancel,
  onConfirm,
}: Props) {
  /**
   * IMPORTANT (Industry Standard):
   * - Do NOT prefill quantities
   * - Physical count is the source of truth
   */

  const [counts, setCounts] = useState<
    { sku: string; quantity: number | null }[]
  >(inventory.map((i) => ({ sku: i.sku, quantity: null })));

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

useState(() => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    setProducts(raw ? JSON.parse(raw) : []);
  } catch {
    setProducts([]);
  }
});

const productMap = useMemo(() => {
  return Object.fromEntries(
    products.map((p) => [p.sku, p.name])
  );
}, [products]);


  /* ================= RESPONSIBLE STAFF ================= */

  const responsibleStaff = useMemo(
    () =>
      shift.staff.find(
        (s: Staff) => s.id === shift.responsibleStaffId
      ),
    [shift]
  );

  /* ================= HELPERS ================= */

  const updateQty = (sku: string, qty: number) => {
    setCounts((prev) =>
      prev.map((c) =>
        c.sku === sku
          ? { ...c, quantity: Math.max(0, qty) }
          : c
      )
    );
  };

  const now = () => new Date().toLocaleString();

  /* ================= SUBMIT ================= */

  const submit = () => {
    // 1️⃣ Ensure everything is counted
    const uncounted = counts.find(
      (c) => c.quantity === null
    );

    if (uncounted) {
      setError(
        "All items must be physically counted before ending the shift."
      );
      return;
    }

    // 2️⃣ Verify responsible staff
    if (!responsibleStaff) {
      setError(
        "Responsible staff not found for this shift."
      );
      return;
    }

    if (!pin) {
      setError("Please enter your PIN.");
      return;
    }

    if (pin !== responsibleStaff.pin) {
      setError(
        "Invalid PIN. Only the responsible staff can end this shift."
      );
      return;
    }

    // 3️⃣ Final confirmation
    const ok = window.confirm(
      "End this shift now?\n\nThe physical count will OVERRIDE system inventory.\nThis action cannot be undone."
    );

    if (!ok) return;

    // 4️⃣ Build authoritative inventory snapshot
    const closingSnapshot: StockSnapshot[] = counts.map(
      (c) => ({
        sku: c.sku,
        quantity: c.quantity as number,
      })
    );

    const updatedInventory = closingSnapshot.map(
      (item) => ({
        sku: item.sku,
        quantity: item.quantity,
        updatedAt: now(),
      })
    );

    // 5️⃣ Overwrite inventory (SOURCE OF TRUTH)
    localStorage.setItem(
      "stockvar_inventory",
      JSON.stringify(updatedInventory)
    );

    // 6️⃣ Broadcast update to InventoryTable
    window.dispatchEvent(
      new CustomEvent("inventory:updated", {
        detail: updatedInventory,
      })
    );

    // 7️⃣ Optional callback (shift logs, reports, etc.)
    onConfirm?.(closingSnapshot);

    // 8️⃣ Close modal
    onCancel();
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              End Shift – Physical Inventory Count
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Physical count overrides system inventory.
            </p>
          </div>

          <button onClick={onCancel}>
            <X />
          </button>
        </div>

        {/* Responsible staff */}
        <div className="text-sm text-gray-600">
          <strong>Responsible staff:</strong>{" "}
          {responsibleStaff?.fullName ?? "Unknown"}
        </div>

        {/* Inventory list */}
        <div className="max-h-80 overflow-y-auto border rounded-lg p-3 space-y-3">
          {counts.map((c) => (
            <div
              key={c.sku}
              className="flex items-center justify-between gap-3"
            >
             <div className="flex flex-col">
  <span className="text-sm font-medium">
    {productMap[c.sku] || c.sku}
  </span>
  <span className="text-xs text-gray-400">
    SKU: {c.sku}
  </span>
</div>


              <input
                type="number"
                min={0}
                placeholder="Enter count"
                value={c.quantity ?? ""}
                onChange={(e) =>
                  updateQty(
                    c.sku,
                    Number(e.target.value)
                  )
                }
                className="
                  w-32 border rounded px-3 py-2 text-sm
                  focus:ring-2 focus:ring-[#0F766E]/30
                "
              />
            </div>
          ))}
        </div>

        {/* PIN input */}
        <div>
          <label className="text-sm font-medium">
            Enter your PIN to end shift
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            placeholder="••••••"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            End Shift
          </button>
        </div>
      </div>
    </div>
  );
}
