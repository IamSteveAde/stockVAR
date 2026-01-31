import NewEntryForm from "../../components/entry/NewEntryForm";
import RoleGuard from "@/app/components/auth/RoleGuard";
export default function NewEntryPage() {
  return (
    <RoleGuard allow={["manager", "owner", "staff"]}>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-[#111827]">New Stock Entry</h1>
      <NewEntryForm />
    </div>
    </RoleGuard>
  );
}