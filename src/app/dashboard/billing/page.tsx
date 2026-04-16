"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { useProfile } from "@/app/context/ProfileContext";
import { getSession } from "@/lib/api/auth";
import { initializeSubscription } from "@/lib/api/business";
import { X } from "lucide-react";
import toast from "react-hot-toast";

/* ✅ Route config (keep this) */
export const dynamic = "force-dynamic";



/* ================= COMPONENT ================= */

export default function BillingPage() {
  const router = useRouter();
  const { subscription } = useSubscription();
  const { profile } = useProfile();
  
  const [loadingPay, setLoadingPay] = useState(false);

  /* ================= HANDLERS ================= */

  const handlePayNow = async () => {
    if (loadingPay) return;
    try {
      setLoadingPay(true);
      const token = getSession()?.token;
      if (!token) throw new Error("No active session");
      
      const payload: any = await initializeSubscription(token);
      if (payload?.paymentUrl) {
         window.location.assign(payload.paymentUrl);
      } else {
         throw new Error("Invalid payment url received.");
      }
    } catch (err: any) {
       toast.error(err.message || "Failed to initialize payment");
    } finally {
       setLoadingPay(false);
    }
  };

  /* ================= LOADING ================= */

  console.log("profile here ===> ",profile)
  console.log("subscription here ===> ",subscription)

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500">
        Loading billing information…
      </div>
    );
  }

  /* ================= REDIRECTS ================= */
  
  // Auto-redirect valid staff away from billing if manually navigated
  useEffect(() => {
    if (profile.role !== "owner" && subscription?.status === "active") {
      router.replace("/dashboard");
    }
  }, [profile.role, subscription?.status, router]);
  

  /* ================= ROLE GUARD ================= */

  // 🚫 Managers & Staff must NOT see billing UI
  if (profile.role !== "owner") {
    if (subscription?.status === "active") {
      return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500 text-center">
          Loading dashboard...
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Subscription required
        </h2>

        <p className="text-sm text-gray-600">
          Your organisation's subscription has expired.
        </p>

        <p className="text-sm text-gray-600">
          Please contact the <strong>account owner</strong> to
          renew the subscription so you can continue using StockVAR.
        </p>
      </div>
    );
  }

  /* ================= REDIRECT AFTER PAYMENT ================= */

  /* ================= REDIRECT AFTER PAYMENT ================= */

  // useEffect(() => {
  //   if (subscription.status === "active") {
  //     router.replace("/dashboard");
  //   }
  // }, [subscription.status, router]);

  /* ================= ACTIVE ================= */

  // if (subscription?.status === "active") {
  //   return (
  //     <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm text-sm text-green-600">
  //       Subscription active. Redirecting…
  //     </div>
  //   );
  // }

  /* ================= OWNER BILLING UI ================= */

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h1 className="text-xl font-semibold">
        Activate your subscription
      </h1>

      <p className="text-sm text-gray-600">
        Subscribe to continue using StockVAR.
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
          ₦60,000 <span className="text-sm">/ month</span>
        </p>
      </div>

      {/* ✅ Safe client-only PayNow trigger */}
      <button 
        onClick={handlePayNow}
        disabled={loadingPay || subscription?.status === "active"}
        className="w-full bg-[#0F3D3A] text-white py-3 rounded-xl font-medium hover:bg-[#0a2927] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingPay ? "Initializing..." : (subscription?.status === "active" ? "Subscribed" : "Pay Now")}
      </button>

    </div>
  );
}