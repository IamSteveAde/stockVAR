"use client";

import { useEffect, useState } from "react";
import AdjustInventoryModal from "./AdjustInventoryModal";

/* ================= TYPES ================= */

type Product = {
  id: number;
  sku: string;
  name: string;
  unit: string;
  status: "active" | "archived";
};

type InventoryItem = {
  sku: string;
  quantity: number;
  updatedAt: string;
};

const PRODUCTS_KEY = "stockvar_products";
const INVENTORY_KEY = "stockvar_inventory";

/* ================= HELPERS ================= */

const now = () => new Date().toLocaleString();

const load = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/* ================= COMPONENT ================= */

export default function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    setProducts(load<Product>(PRODUCTS_KEY));
    setInventory(load<InventoryItem>(INVENTORY_KEY));
  }, []);

  /* ================= SYNC ================= */

  useEffect(() => {
    save(INVENTORY_KEY, inventory);

    // 🔔 Notify the rest of the app (reports, dashboard, etc.)
    window.dispatchEvent(
      new CustomEvent("inventory:updated", {
        detail: inventory,
      })
    );
  }, [inventory]);

  /* ================= ADJUST ================= */

  const adjustInventory = (data: {
    sku: string;
    quantity: number;
    action: "add" | "reduce";
  }) => {
    const product = products.find((p) => p.sku === data.sku);
    if (!product) return;

    setInventory((prev) => {
      const existing = prev.find((i) => i.sku === data.sku);

      if (!existing) {
        return [
          {
            sku: product.sku,
            quantity:
              data.action === "add" ? data.quantity : 0,
            updatedAt: now(),
          },
          ...prev,
        ];
      }

      return prev.map((i) =>
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
      );
    });
  };

  /* ================= JOIN FOR DISPLAY ================= */

  const rows = inventory
    .map((i) => {
      const product = products.find(
        (p) => p.sku === i.sku
      );
      if (!product) return null;

      return {
        sku: i.sku,
        name: product.name,
        unit: product.unit,
        quantity: i.quantity,
        updatedAt: i.updatedAt,
      };
    })
    .filter(Boolean) as {
    sku: string;
    name: string;
    unit: string;
    quantity: number;
    updatedAt: string;
  }[];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Inventory</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg"
        >
          Adjust Inventory
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
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
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  No inventory records yet
                </td>
              </tr>
            )}

            {rows.map((i) => (
              <tr key={i.sku} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {i.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {i.sku}
                </td>
                <td className="px-6 py-4">{i.quantity}</td>
                <td className="px-6 py-4">{i.unit}</td>
                <td className="px-6 py-4 text-gray-500">
                  {i.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <AdjustInventoryModal
          products={products.filter(
            (p) => p.status === "active"
          )}
          onClose={() => setOpen(false)}
          onSave={adjustInventory}
        />
      )}
    </div>
  );
}
