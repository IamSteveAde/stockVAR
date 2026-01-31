import ShiftTable from "../../components/shifts/ShiftTable";
import RoleGuard from "@/app/components/auth/RoleGuard";
export default function ShiftsPage() {
  return (
    <RoleGuard allow={["owner", "manager", "staff"]}>
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Shifts</h1>
      <ShiftTable />
    </div>
    </RoleGuard>
  );
}