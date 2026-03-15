"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordReset } from "@/lib/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await requestPasswordReset({ email });
      setSuccess("Password reset link has been sent to your email.");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as any).message === "string"
          ? (err as any).message
          : "No account found with this email address.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT — FORM */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Image
            src="/images/hero/svicon.png"
            alt="StockVAR"
            width={40}
            height={16}
            priority
          />

          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-[#111827]">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg py-3 text-sm font-medium text-white transition
                ${
                  isLoading
                    ? "bg-[#0F766E]/60 cursor-not-allowed"
                    : "bg-[#0F766E] hover:bg-[#0B5F58]"
                }
              `}
            >
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-sm text-[#6B7280]">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#0F766E] hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <Image
            src="/images/hero/auth.webp"
            alt="Chef working in a kitchen"
            width={320}
            height={320}
            priority
          />
        </div>
      </div>
    </div>
  );
}
