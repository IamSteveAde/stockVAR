"use client";

import AccountLayout from "./component/AccountLayout";
import RoleGuard from "@/app/components/auth/RoleGuard";

export default function AccountPage() {
  return (
    <RoleGuard allow={["owner"]}>
    <div className="p-4 md:p-6">
      <AccountLayout />
    </div>
    </RoleGuard>

  );
}