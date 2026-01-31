import ReportsTabs from "@/app/components/reports/ReportsTabs";
import RoleGuard from "@/app/components/auth/RoleGuard";
import TrialGuard from "@/app/components/guards/TrialGuard";

export default function ReportsPage() {
  return (
    <TrialGuard>
    <RoleGuard allow={["owner", "manager"]}>
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
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
    </RoleGuard>
    </TrialGuard>
  );
}
