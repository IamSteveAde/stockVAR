"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSubscription } from "@/app/context/SubscriptionContext";

export default function TrialGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subscription, isTrialExpired } = useSubscription();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!subscription) return;

    // ✅ ACTIVE users should NEVER be redirected to billing
    if (subscription.status === "active") return;

    // 🚫 Trial expired → force billing (except if already there)
    if (
      subscription.status === "trial" &&
      isTrialExpired &&
      pathname !== "/dashboard/billing"
    ) {
      router.replace("/dashboard/billing");
    }
  }, [subscription, isTrialExpired, pathname, router]);

  return <>{children}</>;
}