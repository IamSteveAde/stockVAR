"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";
import StaffDashboardLayout from "./StaffDashboardLayout";

export default function StaffDashboardPage() {
  const { profile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!profile) return;

    // 🔐 only staff allowed
    if (profile.role !== "staff") {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  if (!profile || profile.role !== "staff") return null;

  return <StaffDashboardLayout />;
}
