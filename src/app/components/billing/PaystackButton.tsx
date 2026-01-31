"use client";

import dynamic from "next/dynamic";

// ⛔ DO NOT IMPORT react-paystack DIRECTLY
const PaystackButton = dynamic(
  async () => {
    const mod = await import("react-paystack");
    return mod.PaystackButton;
  },
  { ssr: false }
);

type Props = {
  email: string;
  amount: number;
  onSuccess: () => void;
};

export default function PaystackPayButton({
  email,
  amount,
  onSuccess,
}: Props) {
  return (
    <PaystackButton
      email={email}
      amount={amount * 100} // Paystack uses kobo
      publicKey={process.env.NEXT_PUBLIC_PAYSTACK_KEY!}
      text="Pay now"
      onSuccess={onSuccess}
      onClose={() => {}}
    />
  );
}