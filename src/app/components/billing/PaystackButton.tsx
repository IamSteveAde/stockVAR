"use client";

import { usePaystackPayment } from "react-paystack";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { useProfile } from "@/app/context/ProfileContext";

type Props = {
  amount: number; // in naira
};

export default function PaystackButton({ amount }: Props) {
  const { activateSubscription } = useSubscription();
  const { profile } = useProfile();

  const config = {
    reference: `stockvar_${Date.now()}`,
    email: profile.email,
    amount: amount * 100, // Paystack uses kobo
    publicKey:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() =>
        initializePayment({
          onSuccess: () => {
            // 🔐 later backend will verify
            activateSubscription();
            alert("Payment successful 🎉");
          },
          onClose: () => {
            alert("Payment cancelled");
          },
        })
      }
      className="w-full bg-[#0F766E] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#0B5F58]"
    >
      Pay ₦{amount.toLocaleString()}
    </button>
  );
}