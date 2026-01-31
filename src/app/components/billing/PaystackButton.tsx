"use client";

import { usePaystackPayment } from "react-paystack";
import { useSubscription } from "@/app/context/SubscriptionContext";

type PaystackButtonProps = {
  amount: number; // in naira
};

export default function PaystackButton({
  amount,
}: PaystackButtonProps) {
  const { activateSubscription } = useSubscription();

  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    return (
      <p className="text-sm text-red-600">
        Paystack public key is missing
      </p>
    );
  }

  const config = {
    reference: `${Date.now()}`,
    email: "customer@stockvar.app", // replace later with real user email
    amount: amount * 100, // kobo
    publicKey,
  };

  const initializePayment =
    usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment({
      onSuccess: () => {
        activateSubscription();
        alert("Payment successful 🎉");
      },
      onClose: () => {
        console.log("Payment closed");
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white hover:bg-[#0B5F58]"
    >
      Pay now
    </button>
  );
}