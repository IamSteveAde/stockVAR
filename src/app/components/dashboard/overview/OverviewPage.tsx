"use client";

import { useState } from "react";
import GlobalFilters from "./GlobalFilters";
import StockItemsTable from "./StockItemsTable";
import { STOCK_DATA } from "./mockdata";

export default function OverviewPage() {
  const [filters, setFilters] = useState<any>({});

  const filtered = STOCK_DATA.filter((r) => {
    const matchDate =
      (!filters.from || r.date >= filters.from) &&
      (!filters.to || r.date <= filters.to);

    const matchProduct =
      !filters.products?.length ||
      filters.products.includes(r.product);

    return matchDate && matchProduct;
  });

  return (
    <div className="space-y-6">
      <GlobalFilters onChange={setFilters} />

      {/* Other overview sections go here (charts, summary) */}

      <StockItemsTable data={filtered} />
    </div>
  );
}