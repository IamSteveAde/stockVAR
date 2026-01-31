import StockTabs from "../../components/stock/StockTabs";
import RoleGuard from "@/app/components/auth/RoleGuard";
import TrialGuard from "@/app/components/guards/TrialGuard";
export default function StockPage() {
  return (
    <TrialGuard>
    <RoleGuard allow={["manager", "owner"]}>
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#111827]">Stock</h1>
      <StockTabs />
    </div>
    </RoleGuard>
    </TrialGuard>
  );
}
