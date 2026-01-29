"use client";

import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Shift } from "../shifts/types";

/* ================= STORAGE KEYS ================= */

const PRODUCTS_KEY = "stockvar_products";
const INVENTORY_KEY = "stockvar_inventory";
const LOGS_KEY = "stockvar_inventory_logs";
const SHIFTS_KEY = "stockvar_shifts";

/* ================= TYPES ================= */

type Product = {
  sku: string;
  name: string;
  unit: string;
};

type InventoryItem = {
  sku: string;
  quantity: number;
  updatedAt: string;
};

/* ================= HELPERS ================= */

const now = () => new Date().toLocaleString();

/* ================= COMPONENT ================= */

export default function NewEntryForm() {
  const [type, setType] = useState<"in" | "out">("out");
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  /* ================= LOAD DATA ================= */

  const loadData = () => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setInventory(JSON.parse(localStorage.getItem(INVENTORY_KEY) || "[]"));

    const shifts: Shift[] = JSON.parse(
      localStorage.getItem(SHIFTS_KEY) || "[]"
    );

    /**
     * INDUSTRY RULE:
     * Exactly ONE running shift can exist.
     */
    const runningShift =
      shifts.find((s) => s.status === "running") || null;

    setActiveShift(runningShift);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("inventory:updated", loadData);
    window.addEventListener("shifts:updated", loadData);

    return () => {
      window.removeEventListener("inventory:updated", loadData);
      window.removeEventListener("shifts:updated", loadData);
    };
  }, []);

  /* ================= SAVE ENTRY ================= */

  const handleSave = () => {
    if (!activeShift) {
      alert("No running shift. Start a shift first.");
      return;
    }

    if (!sku || !quantity) return;

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) return;

    const product = products.find((p) => p.sku === sku);
    if (!product) return;

    const existing = inventory.find((i) => i.sku === sku);

    if (type === "out" && (!existing || qty > existing.quantity)) {
      alert("Invalid stock out quantity");
      return;
    }

    /* ================= UPDATE INVENTORY ================= */

    const updatedInventory: InventoryItem[] = existing
      ? inventory.map((i) =>
          i.sku === sku
            ? {
                ...i,
                quantity:
                  type === "in"
                    ? i.quantity + qty
                    : i.quantity - qty,
                updatedAt: now(),
              }
            : i
        )
      : [
          {
            sku,
            quantity: qty,
            updatedAt: now(),
          },
          ...inventory,
        ];

    localStorage.setItem(
      INVENTORY_KEY,
      JSON.stringify(updatedInventory)
    );
    setInventory(updatedInventory);

    window.dispatchEvent(
      new CustomEvent("inventory:updated", {
        detail: updatedInventory,
      })
    );

    /* ================= WRITE LOG ================= */

    const logs = JSON.parse(
      localStorage.getItem(LOGS_KEY) || "[]"
    );

    logs.unshift({
      id: crypto.randomUUID(),
      sku,
      product: product.name,
      unit: product.unit,
      quantity: qty,
      action: type,
      shiftId: activeShift.id,
      shiftLabel: activeShift.label,
      reason,
      createdAt: now(),
    });

    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));

    window.dispatchEvent(
      new CustomEvent("logs:updated", {
        detail: logs,
      })
    );

    /* ================= RESET ================= */

    setSku("");
    setQuantity("");
    setReason("");

    alert("Stock entry saved");
  };

  /* ================= UI ================= */

  if (!activeShift) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-red-600">
        ⚠️ No running shift.
        <br />
        Start a shift before recording stock movements.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <h2 className="text-xl font-semibold">New Stock Entry</h2>

      <div className="bg-gray-50 border rounded-xl p-4 text-sm">
        <p className="text-gray-500">Active shift</p>
        <p className="font-medium">
          {activeShift.label} ({activeShift.startTime} –{" "}
          {activeShift.endTime})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setType("in")}
          className={`p-4 border rounded-xl flex items-center gap-2 ${
            type === "in"
              ? "border-[#0F766E] bg-[#0F766E]/10"
              : ""
          }`}
        >
          <ArrowUpCircle /> Stock In
        </button>

        <button
          onClick={() => setType("out")}
          className={`p-4 border rounded-xl flex items-center gap-2 ${
            type === "out"
              ? "border-red-500 bg-red-50"
              : ""
          }`}
        >
          <ArrowDownCircle /> Stock Out
        </button>
      </div>

      <select
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className="w-full border rounded-lg px-4 py-3"
      >
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p.sku} value={p.sku}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full border rounded-lg px-4 py-3"
      />

      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="w-full border rounded-lg px-4 py-3"
      />

      <button
        onClick={handleSave}
        disabled={!sku || !quantity}
        className="bg-[#0F766E] text-white px-6 py-3 rounded-lg"
      >
        Save Entry
      </button>
    </div>
  );
}
