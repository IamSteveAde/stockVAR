"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/context/ProfileContext";

type Role = "owner" | "manager" | "staff";

type Props = {
  allow: Role[];
  children: React.ReactNode;
};

export default function RoleGuard({ allow, children }: Props) {
  const { profile } = useProfile();
  const router = useRouter();

  const role = profile.role.toLowerCase() as Role;

  useEffect(() => {
    if (!allow.includes(role)) {
      router.replace("/dashboard"); // fallback
    }
  }, [role, allow, router]);

  if (!allow.includes(role)) {
    return null;
  }

  return <>{children}</>;
}