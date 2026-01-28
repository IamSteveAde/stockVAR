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

  // Load once on mount
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

  // Save whenever products change
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
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-black">Products</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Item</th>
            <th>SKU</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No products added yet
              </td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-3">{p.name}</td>
              <td className="font-mono text-xs">{p.sku}</td>
              <td>{p.unit}</td>
              <td>{p.status}</td>
              <td>{p.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <AddProductModal
          onClose={() => setOpen(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}
