"use client";

import Link from "next/link";

type Props = {
  email?: string;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  onNext: () => void;
};

export default function EmailVerificationStep({
  email,
  confirmed,
  onConfirmedChange,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Verify your email first
        </h1>
        <p className="text-sm text-[#6B7280]">
          A verification link has been sent to the email address provided during account creation.
        </p>
        <p className="text-sm text-[#6B7280]">
          Please check your inbox to verify your account and continue.
        </p>
      </div>

      {email && (
        <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4 text-sm text-[#111827] text-center">
          Sent to: <span className="font-medium">{email}</span>
        </div>
      )}
    </div>
  );
}
