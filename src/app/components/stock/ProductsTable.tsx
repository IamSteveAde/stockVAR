"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  RotateCcw,
  Pencil,
  X,
} from "lucide-react";
import AddProductModal from "./AddProductModal";

/* ================= TYPES ================= */

export type Product = {
  id: number;
  sku: string;
  name: string;
  unit: string;
  status: "active" | "archived";
  updatedAt: string;
};

const STORAGE_KEY = "stockvar_products";

/* ================= HELPERS ================= */

const loadProducts = (): Product[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const now = () => new Date().toLocaleString();

/* ================= COMPONENT ================= */

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Load */
  useEffect(() => {
    setProducts(loadProducts());
    setHydrated(true);
  }, []);

  /* Persist */
  useEffect(() => {
    if (hydrated) saveProducts(products);
  }, [products, hydrated]);

  /* ================= ACTIONS ================= */

  const productExists = (name: string, ignoreId?: number) =>
    products.some(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        p.id !== ignoreId
    );

  const addProduct = (data: {
    name: string;
    sku: string;
    unit: string;
  }) => {
    if (productExists(data.name)) {
      setError("Product already exists");
      return;
    }

    setProducts((prev) => [
      {
        id: Date.now(),
        name: data.name,
        sku: data.sku,
        unit: data.unit,
        status: "active",
        updatedAt: now(),
      },
      ...prev,
    ]);

    setError(null);
  };

  const saveEdit = () => {
    if (!editing) return;

    if (productExists(editing.name, editing.id)) {
      setError("Another product with this name already exists");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editing.id
          ? { ...editing, updatedAt: now() }
          : p
      )
    );

    setEditing(null);
    setError(null);
  };

  const toggleArchive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "active" ? "archived" : "active",
              updatedAt: now(),
            }
          : p
      )
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Products</h3>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Unit</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Updated</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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
                <td className="px-6 py-4 text-gray-500">{p.updatedAt}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setEditing({ ...p })}
                    className="inline-flex items-center gap-1 text-xs border px-3 py-1 rounded-lg"
                  >
                    <Pencil size={12} /> Edit
                  </button>

                  <button
                    onClick={() => toggleArchive(p.id)}
                    className="inline-flex items-center gap-1 text-xs border px-3 py-1 rounded-lg"
                  >
                    {p.status === "archived" ? (
                      <>
                        <RotateCcw size={12} /> Unarchive
                      </>
                    ) : (
                      <>
                        <Archive size={12} /> Archive
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {openAdd && (
        <AddProductModal
          onClose={() => setOpenAdd(false)}
          onAdd={addProduct}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Edit product</h3>
              <button onClick={() => setEditing(null)}>
                <X size={16} />
              </button>
            </div>

            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              value={editing.sku}
              disabled
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500"
            />

            <select
              value={editing.unit}
              onChange={(e) =>
                setEditing({ ...editing, unit: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="kg">Kg</option>
              <option value="litres">Litres</option>
              <option value="bags">Bags</option>
              <option value="pcs">Pieces</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
