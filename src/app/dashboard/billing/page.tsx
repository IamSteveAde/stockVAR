"use client";

export const dynamic = "force-dynamic";

import PaystackPayButton from "@/app/components/billing/PaystackButton";
import { useSubscription } from "@/app/context/SubscriptionContext";

export default function BillingPage() {
  const { subscription, activateSubscription } = useSubscription();

  // Guard (extra safe, avoids edge crashes)
  if (!subscription) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500">
        Loading billing information…
      </div>
    );
  }

  const isActive = subscription.status === "active";

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Activate your subscription
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Your free trial has ended. Subscribe to continue using StockVAR.
        </p>
      </div>

      {/* Plan card */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-black">
          StockVAR Pro
        </h3>

        <p className="text-sm text-gray-500">
          Unlimited stock tracking, staff, reports & analytics
        </p>

        <p className="text-2xl font-semibold text-gray-900">
          ₦50,000 <span className="text-sm font-normal">/ month</span>
        </p>
      </div>

      {/* Paystack */}
      {!isActive && (
        <PaystackPayButton
          email="owner@stockvar.app"
          amount={50000}
          onSuccess={() => {
            activateSubscription();
          }}
        />
      )}

      {/* Status */}
      {isActive && (
        <p className="text-green-600 text-sm font-medium">
          Subscription active ✅
        </p>
      )}
    </div>
  );
}