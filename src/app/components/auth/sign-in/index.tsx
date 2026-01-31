"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type UserRole = "owner" | "manager" | "staff";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // 🔴 MOCK LOGIN API
    setTimeout(() => {
      setIsLoading(false);

      const isSuccess = true;

      if (!isSuccess) {
        setError("Invalid email or password.");
        return;
      }

      // 🔑 MOCK ROLE (change this to test flows)
      const mockRole: UserRole = "staff"; // "owner" | "manager" | "staff"

      // 🔐 Store mock session (frontend-only for now)
      localStorage.setItem(
        "stockvar_user",
        JSON.stringify({
          role: mockRole,
        })
      );

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        router.push(
          mockRole === "staff"
            ? "/dashboard/shift"
            : "/dashboard"
        );
      }, 800);
    }, 1500);
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Log in to continue managing your stock.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Password
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#0F766E] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

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
              {isLoading ? "Processing..." : "Log in"}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-[#6B7280]">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-[#0F766E] hover:underline"
            >
              Create one
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