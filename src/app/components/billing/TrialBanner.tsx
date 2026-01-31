"use client";

import { AlertTriangle } from "lucide-react";
import { useSubscription } from "@/app/context/SubscriptionContext";
import Link from "next/link";

export default function TrialBanner() {
  const { subscription, trialDaysLeft } = useSubscription();

  if (!subscription || subscription.status !== "trial") {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col gap-2
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* Left: Message */}
        <div className="flex items-start sm:items-center gap-2 text-yellow-800">
          <AlertTriangle size={16} className="mt-0.5 sm:mt-0 shrink-0" />

          <p className="text-sm leading-snug">
            Free trial ends in{" "}
            <strong>
              {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"}
            </strong>
          </p>
        </div>

        {/* Right: CTA */}
        <Link
          href="/dashboard/billing"
          className="
            text-sm font-medium text-[#0F766E]
            hover:underline
            self-start sm:self-auto
          "
        >
          Upgrade now
        </Link>
      </div>
    </div>
  );
}