"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "@/lib/api/auth";
import { updateMyProfile } from "@/lib/api/profile";

const COUNTRIES = [
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
  },
  {
    code: "GH",
    name: "Ghana",
    dialCode: "+233",
    flag: "🇬🇭",
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    flag: "🇰🇪",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
  },
];

export default function Signup() {
  const router = useRouter();
  const [country, setCountry] = useState(COUNTRIES[0]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${country.dialCode}${phone}`;

    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!phone || phone.trim().length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Create account on backend
      await signUp({
        fullName: fullName || undefined,
        email,
        phone: fullPhone,
        phoneNumber: fullPhone,
        password,
      });

      setSuccess("Account created. Continue onboarding to set up your business.");

      // Step 2: Redirect to onboarding
      // ProfileContext will auto-fetch profile from backend
      setTimeout(() => {
        router.push("/onboarding/create-business");
      }, 1000);
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as any).message === "string"
          ? (err as any).message
          : "Unable to create account. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ade Johnson"
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

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

           {/* Phone */}
<div>
  <label className="block text-sm font-medium text-[#111827]">
    Phone number
  </label>

  <div className="mt-2 flex rounded-lg border border-[#E5E7EB] focus-within:border-[#0F766E] overflow-hidden">
   {/* Country selector */}
<select
  value={country.code}
  onChange={(e) =>
    setCountry(
      COUNTRIES.find((c) => c.code === e.target.value)!
    )
  }
  className="
    bg-gray-50 px-2 py-3 text-sm
    border-r outline-none cursor-pointer
    w-[90px] flex-shrink-0
  "
>
  {COUNTRIES.map((c) => (
    <option key={c.code} value={c.code}>
      {c.flag} {c.dialCode}
    </option>
  ))}
</select>

    {/* Phone input */}
    <input
      type="tel"
      required
      inputMode="numeric"
      value={phone}
      onChange={(e) =>
        setPhone(e.target.value.replace(/\D/g, ""))
      }
      placeholder="8031234567"
      className="flex-1 px-4 py-3 text-sm outline-none"
    />
  </div>

  <p className="mt-1 text-xs text-gray-500">
    Country code is added automatically
  </p>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 pr-12 text-sm outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6B7280]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 pr-12 text-sm outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6B7280]"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
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
              className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white transition hover:bg-[#0B5F58] disabled:opacity-60"
            >
              {isLoading ? "Creating account…" : "Create account"}
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
      <div className="relative hidden lg:block">
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
