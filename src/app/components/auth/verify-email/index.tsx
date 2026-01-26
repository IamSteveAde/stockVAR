"use client";

import Link from "next/link";
import Image from "next/image";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT — CONTENT */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <Image
            src="/images/hero/svicon.png"
            alt="StockVAR"
            width={40}
            height={16}
            priority
            className="mx-auto"
          />

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F766E]/10">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F766E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-[#111827]">
              Check your email
            </h1>
            <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
              We’ve sent a verification link to your email address.  
              Click the link to verify your account and continue.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              type="button"
              className="w-full rounded-lg border border-[#E5E7EB] py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F3F4F6]"
            >
              Resend verification email
            </button>

            <p className="text-sm text-[#6B7280]">
              Already verified?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[#0F766E] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="relative hidden lg:block ">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <Image
            src="/images/hero/auth.webp"
            alt="Chef illustration"
            width={320}
            height={320}
            priority
          />
        </div>
      </div>
    </div>
  );
}
