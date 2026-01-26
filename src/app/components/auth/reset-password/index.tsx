"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
              Set a new password
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                New password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 pr-12 text-sm outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6B7280]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Confirm new password
              </label>
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 pr-12 text-sm outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6B7280]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white transition hover:bg-[#0B5F58]"
            >
              Update password
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-sm text-[#6B7280]">
            Back to{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#0F766E] hover:underline"
            >
              login
            </Link>
          </p>
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
