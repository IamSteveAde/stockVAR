"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const router = useRouter();

const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);


const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  setError(null);
  setSuccess(null);
  setIsLoading(true);

  // Simulate API call
  setTimeout(() => {
    setIsLoading(false);

    const isSuccess = true; // toggle to test error state

    if (isSuccess) {
      setSuccess("Account created successfully. Check your email.");
      setTimeout(() => {
        router.push("/auth/verify-email");
      }, 1200);
    } else {
      setError("An account with this email already exists.");
    }
  }, 1500);
};

  

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT — FORM */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md space-y-2">
          {/* Logo */}
          <Image
            src="/images/hero/svicon.png"
            alt="StockVAR"
            width={30}
            height={16}
            priority
          />

          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-[#111827]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Start tracking stock and detecting variance with clarity.
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Confirm password
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

            
            {/* Error message */}
{error && (
  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
    {error}
  </div>
)}

{/* Success message */}
{success && (
  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
    {success}
  </div>
)}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white transition hover:bg-[#0B5F58]"
            >
              Create account
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#0F766E] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="relative hidden lg:block ">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <Image
            src="/images/hero/auth.webp"
            alt="Restaurant chef illustration"
            width={320}
            height={320}
            priority
          />
        </div>
      </div>
    </div>
  );
}
