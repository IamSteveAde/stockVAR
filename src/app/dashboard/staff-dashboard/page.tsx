"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";
import StaffDashboardLayout from "./StaffDashboardLayout";

const DEV_BYPASS = true; // 🔥 turn off before production

export default function StaffDashboardPage() {
  const { profile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (DEV_BYPASS) return;

    if (!profile) return;

    if (profile.role !== "staff") {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  if (DEV_BYPASS) {
    return <StaffDashboardLayout />;
  }

  if (!profile || profile.role !== "staff") return null;

  return <StaffDashboardLayout />;
}
