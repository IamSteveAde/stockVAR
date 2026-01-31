import StockTabs from "../../components/stock/StockTabs";
import RoleGuard from "@/app/components/auth/RoleGuard";
export default function StockPage() {
  return (
    <RoleGuard allow={["manager", "owner"]}>
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#111827]">Stock</h1>
      <StockTabs />
    </div>
    </RoleGuard>
  );
}
