import ReportsTabs from "@/app/components/reports/ReportsTabs";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">
          Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track variance, products, and staff activity across shifts
        </p>
      </div>

      {/* Reports content */}
      <ReportsTabs />
    </div>
  );
}