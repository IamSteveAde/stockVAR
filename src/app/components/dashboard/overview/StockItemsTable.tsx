"use client";

import { useState } from "react";
import { StockRow } from "./mockdata";
import { exportToCSV } from "./exportCsv";

const PAGE_SIZE = 10;

export default function StockItemsTable({ data }: { data: StockRow[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const slice = data.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Stock items (daily)</h3>

        <button
          onClick={() => exportToCSV(slice)}
          className="text-sm bg-[#0F766E] text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Item</th>
              <th>Opening</th>
              <th>Used</th>
              <th>Closing</th>
              <th>VAR</th>
            </tr>
          </thead>

          <tbody>
            {slice.map((r, i) => {
              const variance = r.opening - (r.used + r.closing);
              return (
                <tr key={i} className="border-t">
                  <td className="px-6 py-3 font-medium">{r.product}</td>
                  <td>{r.opening}</td>
                  <td>{r.used}</td>
                  <td>{r.closing}</td>
                  <td
                    className={`font-semibold ${
                      variance !== 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {variance} {r.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between px-6 py-4 border-t">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border rounded-lg px-3 py-1"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border rounded-lg px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}