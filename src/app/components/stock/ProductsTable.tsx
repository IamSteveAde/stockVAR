"use client";

import { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";

export type Product = {
  id: number;
  sku: string;
  name: string;
  unit: string;
  status: "active" | "archived";
  updatedAt: string;
};

const STORAGE_KEY = "stockvar_products";

export default function ProductsTable() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Load once
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts([]);
      }
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (data: {
    name: string;
    sku: string;
    unit: string;
  }) => {
    setProducts((prev) => [
      {
        id: Date.now(),
        name: data.name,
        sku: data.sku,
        unit: data.unit,
        status: "active",
        updatedAt: "Just now",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Products</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0B5F58]"
        >
          Add Product
        </button>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden space-y-3">
        {products.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400 bg-white rounded-xl">
            No products added yet
          </div>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{p.name}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  p.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {p.status}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              SKU: <span className="font-mono">{p.sku}</span>
            </p>
            <p className="text-sm text-gray-600">Unit: {p.unit}</p>
            <p className="text-xs text-gray-400">Updated: {p.updatedAt}</p>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 bg-gray-50">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  No products added yet
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                <td className="px-6 py-4">{p.unit}</td>
                <td className="px-6 py-4 capitalize">{p.status}</td>
                <td className="px-6 py-4 text-gray-500">
                  {p.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <AddProductModal
          onClose={() => setOpen(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}