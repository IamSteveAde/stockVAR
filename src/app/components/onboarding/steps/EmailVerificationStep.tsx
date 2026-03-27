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
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Verify your email first
        </h1>
        <p className="text-sm text-[#6B7280]">
          Email verification is part of onboarding and required before entering your dashboard.
        </p>
      </div>

      {email && (
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827]">
          Verification email was sent to <span className="font-medium">{email}</span>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href="/auth/verify-email"
          className="block w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-center text-sm font-medium text-[#111827] hover:bg-[#F3F4F6]"
        >
          Open email verification page
        </Link>

        <label className="flex items-start gap-3 rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827]">
          <input
            type="checkbox"
            className="mt-1"
            checked={confirmed}
            onChange={(event) => onConfirmedChange(event.target.checked)}
          />
          <span>I have verified my email and I am ready to continue onboarding.</span>
        </label>
      </div>

      <button
        onClick={onNext}
        disabled={!confirmed}
        className="w-full rounded-lg bg-[#0F766E] py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue setup
      </button>
    </div>
  );
}
