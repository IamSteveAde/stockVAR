"use client";

import PaystackButton from "@/app/components/billing/PaystackButton";
import { useSubscription } from "@/app/context/SubscriptionContext";

export default function BillingPage() {
  const { subscription } = useSubscription();

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h1 className="text-xl font-semibold">
        Activate your subscription
      </h1>

      <p className="text-sm text-gray-600">
        Your free trial has ended. Subscribe to
        continue using StockVAR.
      </p>

      {/* Plan card */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-black">StockVAR Pro</h3>
        <p className="text-sm text-gray-500">
          Unlimited stock tracking, staff,
          reports & analytics
        </p>

        <p className="text-2xl font-semibold">
          ₦50,000 <span className="text-sm">/ month</span>
        </p>
      </div>

      <PaystackButton amount={50000} />

      {subscription?.status === "active" && (
        <p className="text-green-600 text-sm">
          Subscription active ✅
        </p>
      )}
    </div>
  );
}