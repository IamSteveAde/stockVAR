"use client";

import { useState } from "react";
import {
  Database,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

type ExportType = "stock" | "reports";

export default function DataExport() {
  const [exporting, setExporting] = useState<ExportType | null>(
    null
  );

  const handleExport = async (type: ExportType) => {
    setExporting(type);

    // ⏳ simulate export delay
    await new Promise((r) => setTimeout(r, 1500));

    // 🔽 simulate file download
    const blob = new Blob(
      [`Exported ${type} data`],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download =
      type === "stock"
        ? "stock-data.csv"
        : "reports-data.csv";
    a.click();

    URL.revokeObjectURL(url);
    setExporting(null);
  };

  return (
    <section
      aria-labelledby="data-export-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header>
        <h2
          id="data-export-heading"
          className="font-medium text-lg text-gray-900"
        >
          Data & exports
        </h2>
        <p className="text-xs text-gray-500">
          Download your operational data in CSV format
        </p>
      </header>

      {/* Export actions */}
      <div className="space-y-4">
        <ExportRow
          icon={Database}
          title="Stock data"
          description="Current stock levels, usage, and variance"
          loading={exporting === "stock"}
          onExport={() => handleExport("stock")}
        />

        <ExportRow
          icon={FileText}
          title="Reports"
          description="Generated reports and historical summaries"
          loading={exporting === "reports"}
          onExport={() => handleExport("reports")}
        />
      </div>
    </section>
  );
}

/* =======================
   EXPORT ROW
======================= */

function ExportRow({
  icon: Icon,
  title,
  description,
  loading,
  onExport,
}: {
  icon: any;
  title: string;
  description: string;
  loading: boolean;
  onExport: () => void;
}) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-gray-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {title}
          </p>
          <p className="text-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onExport}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />
            Exporting…
          </>
        ) : (
          <>
            <Download size={16} />
            Export CSV
          </>
        )}
      </button>
    </div>
  );
}
