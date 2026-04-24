"use client";

import { useState } from "react";
import {
  Database,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { getSession } from "@/lib/api/auth";
import { downloadVarianceReport, downloadInventoryReport } from "@/lib/api/reports";

type ExportType = "stock" | "reports";

export default function DataExport() {
  const [exporting, setExporting] = useState<ExportType | null>(
    null
  );

  const handleExport = async (type: ExportType) => {
    const session = getSession();
    if (!session?.token) {
      alert("Please log in to export data.");
      return;
    }

    setExporting(type);

    try {
      const response = type === "stock" 
        ? await downloadInventoryReport(session.token)
        : await downloadVarianceReport(session.token);

      const blob = await response.blob();
      
      // Try to get filename from Content-Disposition header
      const contentDisp = response.headers.get("Content-Disposition");
      let filename = type === "stock" ? "stock-data.pdf" : "reports-data.pdf";
      
      if (contentDisp && contentDisp.includes("filename=")) {
        const parts = contentDisp.split("filename=");
        if (parts[1]) {
          filename = parts[1].replace(/["']/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Export failed:", error);
      alert(error.message || "Export failed. Please try again later.");
    } finally {
      setExporting(null);
    }
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
