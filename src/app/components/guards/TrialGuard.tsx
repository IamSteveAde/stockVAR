"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { useProfile } from "@/app/context/ProfileContext";

export default function TrialGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isTrialExpired } = useSubscription();
  const { profile } = useProfile();

  useEffect(() => {
    if (!isTrialExpired) return;

    if (profile.role === "owner") {
      router.replace("/dashboard/billing");
    } else {
      router.replace("/dashboard/access-locked");
    }
  }, [isTrialExpired, profile.role, router]);

  if (isTrialExpired) return null;

  return <>{children}</>;
}