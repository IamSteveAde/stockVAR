"use client";

import { useState } from "react";

const PRODUCTS = ["Rice", "Oil", "Chicken", "Tomatoes"];

export default function GlobalFilters({
  onChange,
}: {
  onChange: (f: {
    from?: string;
    to?: string;
    products: string[];
  }) => void;
}) {
  const [products, setProducts] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
      <input
        type="date"
        value={from}
        onChange={(e) => {
          setFrom(e.target.value);
          onChange({ from: e.target.value, to, products });
        }}
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={to}
        onChange={(e) => {
          setTo(e.target.value);
          onChange({ from, to: e.target.value, products });
        }}
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <select
        multiple
        className="border rounded-lg px-3 py-2 text-sm"
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions).map(
            (o) => o.value
          );
          setProducts(values);
          onChange({ from, to, products: values });
        }}
      >
        {PRODUCTS.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}