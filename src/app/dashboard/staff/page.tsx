import StaffTable from "../../components/staff/StaffTable";
import RoleGuard from "@/app/components/auth/RoleGuard";

export default function StaffPage() {
  return (
    <RoleGuard allow={["owner", "manager"]}>
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Staff</h1>
      <StaffTable />
    </div>
    </RoleGuard>
  );
}