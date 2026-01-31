"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic"; // 👈 renamed
import { useSubscription } from "@/app/context/SubscriptionContext";
import { useProfile } from "@/app/context/ProfileContext";

/* ✅ Route config (keep this) */
export const dynamic = "force-dynamic";

/* ✅ Client-only Paystack import */
const PaystackButton = dynamicImport(
  () => import("@/app/components/billing/PaystackButton"),
  { ssr: false }
);

/* ================= COMPONENT ================= */

export default function BillingPage() {
  const router = useRouter();
  const { subscription } = useSubscription();
  const { profile } = useProfile();

  /* ================= LOADING ================= */

  if (!profile || !subscription) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500">
        Loading billing information…
      </div>
    );
  }

  /* ================= ROLE GUARD ================= */

  // 🚫 Managers & Staff must NOT see billing
  if (profile.role !== "owner") {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Subscription required
        </h2>

        <p className="text-sm text-gray-600">
          Your organisation’s subscription has expired.
        </p>

        <p className="text-sm text-gray-600">
          Please contact the <strong>account owner</strong> to
          renew the subscription so you can continue using StockVAR.
        </p>
      </div>
    );
  }

  /* ================= REDIRECT AFTER PAYMENT ================= */

  useEffect(() => {
    if (subscription.status === "active") {
      router.replace("/dashboard");
    }
  }, [subscription.status, router]);

  /* ================= ACTIVE ================= */

  if (subscription.status === "active") {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-green-600">
        Subscription active. Redirecting…
      </div>
    );
  }

  /* ================= OWNER BILLING UI ================= */

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h1 className="text-xl font-semibold">
        Activate your subscription
      </h1>

      <p className="text-sm text-gray-600">
        Your free trial has ended. Subscribe to continue using StockVAR.
      </p>

      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-black">
          StockVAR Pro
        </h3>

        <p className="text-sm text-gray-500">
          Unlimited stock tracking, staff,
          reports & analytics
        </p>

        <p className="text-2xl font-semibold">
          ₦100 <span className="text-sm">/ month</span>
        </p>
      </div>

      {/* ✅ Safe client-only Paystack */}
      <PaystackButton amount={100} />
    </div>
  );
}