"use client";

import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
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
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@business.com"
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white transition hover:bg-[#0B5F58]"
            >
              Send reset link
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
      <div className="relative hidden lg:block ">
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
