"use client";

import { useState } from "react";
import { Shift, StockSnapshot } from "./types";

type InventoryItem = {
  sku: string;
  quantity: number;
};

type Props = {
  shift: Shift;
  inventory: InventoryItem[];
  onCancel: () => void;
  onConfirm: (closingSnapshot: StockSnapshot[]) => void;
};

export default function CloseShiftModal({
  shift,
  inventory,
  onCancel,
  onConfirm,
}: Props) {
  const [counts, setCounts] = useState<StockSnapshot[]>(
    inventory.map((i) => ({ sku: i.sku, quantity: i.quantity }))
  );

  const updateQty = (sku: string, qty: number) => {
    setCounts((prev) =>
      prev.map((c) =>
        c.sku === sku ? { ...c, quantity: Math.max(0, qty) } : c
      )
    );
  };

  const submit = () => {
    const ok = window.confirm(
      "End this shift now? This action cannot be undone."
    );
    if (!ok) return;
    onConfirm(counts);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">End Shift – Physical Count</h2>
        <p className="text-sm text-gray-500">
          Count each item physically and enter the actual quantity left.
        </p>

        <div className="max-h-80 overflow-y-auto border rounded-lg p-3 space-y-3">
          {counts.map((c) => (
            <div
              key={c.sku}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-sm font-medium">{c.sku}</span>
              <input
                type="number"
                min={0}
                value={c.quantity}
                onChange={(e) =>
                  updateQty(c.sku, Number(e.target.value))
                }
                className="w-28 border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>

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
