"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResend = () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      const isSuccess = true; // toggle to false to test error

      if (isSuccess) {
        setSuccess("Verification email has been resent. Check your inbox.");
      } else {
        setError("Too many requests. Please try again later.");
      }
    }, 1500);
  };

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
              <br />
              Click the link to verify your account and continue.
            </p>
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className={`w-full rounded-lg py-3 text-sm font-medium transition
                ${
                  isLoading
                    ? "border border-[#E5E7EB] bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                    : "border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]"
                }
              `}
            >
              {isLoading
                ? "Resending verification email..."
                : "Resend verification email"}
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
      <div className="relative hidden lg:block">
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
