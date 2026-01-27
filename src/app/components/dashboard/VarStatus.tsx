"use client";

import { useState } from "react";
import { Calendar, Filter } from "lucide-react";

const PRODUCTS = ["Rice", "Oil", "Chicken", "Tomatoes", "Milk"];

export default function VarStatus() {
    const [openDate, setOpenDate] = useState(false);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

  const [openFilter, setOpenFilter] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((p) => p !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
  <h3 className="text-sm font-medium text-[#0F766E]">VAR Overview</h3>
  <button className="text-xs text-[#0F766E] hover:underline">
    View full report
  </button>
</div>


      {/* Filters */}
<div className="flex flex-wrap gap-3 items-center">
  {/* Date range */}
  <div className="relative">
    <button
      onClick={() => setOpenDate(!openDate)}
      className="flex items-center gap-2 border rounded-lg px-3 py-1 text-sm"
    >
      <Calendar size={16} />
      {startDate && endDate
        ? `${startDate} → ${endDate}`
        : "Select date range"}
    </button>

    {openDate && (
      <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 space-y-3">
        <div>
          <label className="block text-xs text-gray-500">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={() => setOpenDate(false)}
          className="w-full bg-[#0F766E] text-white rounded-md py-1.5 text-sm"
        >
          Apply
        </button>
      </div>
    )}
  </div>

  {/* Product filter */}
  <div className="relative">
    <button
      onClick={() => setOpenFilter(!openFilter)}
      className="flex items-center gap-2 border rounded-lg px-3 py-1 my-2 text-sm"
    >
      <Filter size={16} />
      Filter products
    </button>

    {openFilter && (
      <div className="absolute z-20 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 space-y-2">
        {PRODUCTS.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
            />
            {item}
          </label>
        ))}

        <button
          onClick={() => setOpenFilter(false)}
          className="w-full mt-2 bg-[#0F766E] text-white rounded-lg py-1 text-sm"
        >
          Apply
        </button>
      </div>
    )}
  </div>
</div>


      {/* Chart placeholder */}
      <div className="flex-1 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-sm text-gray-500">
  VAR trend for selected products & date range
</div>

    </div>
  );
}
