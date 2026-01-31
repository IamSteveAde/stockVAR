import ShiftTable from "../../components/shifts/ShiftTable";
import RoleGuard from "@/app/components/auth/RoleGuard";
import TrialGuard from "@/app/components/guards/TrialGuard";
export default function ShiftsPage() {
  return (
    <TrialGuard>
    <RoleGuard allow={["owner", "manager", "staff"]}>
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Shifts</h1>
      <ShiftTable />
    </div>
    </RoleGuard>
    </TrialGuard>
  );
}