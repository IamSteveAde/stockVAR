"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  RotateCcw,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddProductModal from "./AddProductModal";
import { writeAuditLog } from "../../../lib/audit";
import { useProfile } from "@/app/context/ProfileContext";


import { getSession } from "@/lib/api/auth";
import { createProduct, listProducts } from "@/lib/api/stock";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

export type Product = {
  id: string | number;
  sku: string;
  name: string;
  unit: string;
  status: "active" | "archived";
  updatedAt: string;
};

const STORAGE_KEY = "stockvar_products";



/* ================= HELPERS ================= */

const loadProducts = (): Product[] => {
  return []; // Fall back removed globally
};

const saveProducts = (products: Product[]) => {
  // Purged: Products are natively fetched natively off API and persist only backend securely.
};

const now = () => new Date().toLocaleString();

/* ================= COMPONENT ================= */

export default function ProductsTable() {
  const PAGE_SIZE = 10;
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const { profile } = useProfile();
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Load */
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const response: any = await listProducts(token, page, PAGE_SIZE);
        if (mounted && response && response.products) {
          const mapped = response.products.map((p: any) => ({
            id: p.uid || p.id,
            sku: p.uid || p.sku,
            name: p.name,
            unit: p.unit,
            status: (p.status?.toLowerCase() as "active" | "archived") || "active",
            updatedAt: p.updatedAt || now()
          }));
          setProducts(mapped);
          setTotalPages(response.meta?.pageCount || 1);
          setTotalCount(response.meta?.totalCount || mapped.length);
          setHydrated(true);
          return;
        }
      } catch (err) { }

      if (mounted) {
        const stored = loadProducts();
        if (stored.length > 0) {
          setProducts(stored);
          setTotalCount(stored.length);
        }
        setHydrated(true);
      }
    };
    hydrate();
    return () => { mounted = false; };
  }, [page]);

  /* Persist */
  useEffect(() => {
    if (hydrated) saveProducts(products);
  }, [products, hydrated]);

  /* ================= ACTIONS ================= */

  const productExists = (name: string, ignoreId?: string | number) =>
    products.some(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        p.id !== ignoreId
    );

  const addProduct = async (data: {
    name: string;
    unit: string;
  }) => {
    const token = getSession()?.token;
    if (!token) throw new Error("Authentication required");

    try {
      const created = (await createProduct(data, token)) as any;

      setProducts((prev) => [
        {
          id: created.uid || Date.now(),
          sku: created.uid || `STK-${data.name}`,
          name: created.name || data.name,
          unit: created.unit || data.unit,
          status: (created.status?.toLowerCase() as "active" | "archived") || "active",
          updatedAt: created.updatedAt || now(),
        },
        ...prev,
      ]);

      setError(null);

    } catch (err: any) {
      setError(err.message || "An error occurred creating the product");
      throw err;
    }
  };

  const saveEdit = () => {
    if (!editing) return;

    if (productExists(editing.name, editing.id)) {
      setError("Another product with this name already exists");
      return;
    }

    const before = products.find((p) => p.id === editing.id);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editing.id
          ? { ...editing, updatedAt: now() }
          : p
      )
    );

    writeAuditLog({
      actor: {
        staffId: (profile as any).id,
        name: profile.fullName,
        role: profile.role,
      },
      action: "PRODUCT_EDIT",
      description: "Product updated",
      entity: {
        type: "product",
        id: editing.sku,
        name: editing.name,
      },
      changes: {
        before,
        after: editing,
      },
    });

    setEditing(null);
    setError(null);
  };


  const toggleArchive = (id: string | number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const updatedStatus =
      product.status === "active" ? "archived" : "active";

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            status: updatedStatus,
            updatedAt: now(),
          }
          : p
      )
    );

    writeAuditLog({
      actor: {
        staffId: (profile as any).id,
        name: profile.fullName,
        role: profile.role,
      },
      action: "PRODUCT_ARCHIVE",
      description:
        updatedStatus === "archived"
          ? "Product archived"
          : "Product unarchived",
      entity: {
        type: "product",
        id: product.sku,
        name: product.name,
      },
      changes: {
        before: { status: product.status },
        after: { status: updatedStatus },
      },
    });
  };


  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-medium text-black">Products</h3>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add Product
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* ================= MOBILE & TABLET (CARDS) ================= */}
      <div className="md:hidden space-y-3">
        {products.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">
            No products added yet
          </div>
        )}

        {products.map((p, index) => (

          <div
            key={p.id}
            className="bg-white rounded-xl border p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  #{index + 1}
                </p>

                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-500 font-mono">
                  SKU: {p.sku}
                </p>
              </div>

              <span className="text-xs capitalize px-2 py-1 rounded-full bg-gray-100">
                {p.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 flex gap-6">
              <span>
                <strong>Unit:</strong> {p.unit}
              </span>
              <span>
                <strong>Updated:</strong> {p.updatedAt}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditing({ ...p })}
                className="flex-1 inline-flex items-center justify-center gap-1 text-xs border px-3 py-2 rounded-lg"
              >
                <Pencil size={12} /> Edit
              </button>

              <button
                onClick={() => toggleArchive(p.id)}
                className="flex-1 inline-flex items-center justify-center gap-1 text-xs border px-3 py-2 rounded-lg"
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

            {products.map((p, index) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-4 text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                <td className="px-6 py-4">{p.unit}</td>
                <td className="px-6 py-4 capitalize">{p.status}</td>
                <td className="px-6 py-4 text-gray-500">
                  {p.updatedAt}
                </td>
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

      {/* ================= ADD MODAL ================= */}
      {openAdd && (
        <AddProductModal
          onClose={() => setOpenAdd(false)}
          onAdd={addProduct}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
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
