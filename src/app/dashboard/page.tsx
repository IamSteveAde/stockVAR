import DashboardLayout from "../components/dashboard/DashboardLayout";
import RoleGuard from "../components/auth/RoleGuard";
import TrialGuard from "../components/guards/TrialGuard";
export default function DashboardPage() {
  return <TrialGuard> <RoleGuard allow={["manager", "owner"]}> <DashboardLayout /></RoleGuard> </TrialGuard>;
}
