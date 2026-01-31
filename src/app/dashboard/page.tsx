import DashboardLayout from "../components/dashboard/DashboardLayout";
import RoleGuard from "../components/auth/RoleGuard";
export default function DashboardPage() {
  return <RoleGuard allow={["manager", "owner"]}> <DashboardLayout /></RoleGuard>;
}
