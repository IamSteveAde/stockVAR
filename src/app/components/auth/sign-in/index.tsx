"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/api/auth";
import { getMyBusinessProfile } from "@/lib/api/business";
import { getMyProfile, updateMyProfile } from "@/lib/api/profile";
import { markOnboardingComplete, readSignupName } from "@/lib/onboarding";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      setIsLoading(true);

      // Step 1: Sign in and get session
      const session = await login({ email, password });
      const businessProfile = await getMyBusinessProfile(session.token);
      const preferredFullName =
        businessProfile?.fullName?.trim() ||
        session.user?.fullName?.trim() ||
        readSignupName().trim();
      const preferredEmail =
        businessProfile?.email?.trim() || session.user?.email;
      const preferredPhone = businessProfile?.phone?.trim();

      // Step 2: Sync the stored onboarding identity from /api/profile/me/business into /api/profile/me.
      try {
        await updateMyProfile(
          {
            fullName: preferredFullName || undefined,
            email: preferredEmail,
            phone: preferredPhone,
            status: "active",
          },
          session.token
        );

        const backendProfile = await getMyProfile(session.token);
        if (backendProfile && typeof backendProfile === "object") {
          saveSession({
            ...session,
            user: {
              ...session.user,
              id: backendProfile.id || session.user.id,
              fullName:
                backendProfile.fullName ||
                preferredFullName ||
                session.user.fullName,
              email: backendProfile.email || session.user.email,
              role: backendProfile.role || session.user.role,
            },
          });
        }
      } catch {
        // Non-blocking: fallback to the session returned from auth endpoint.
      }

      setSuccess("Login successful. Redirecting...");

      // Step 3: Check if user has completed onboarding via business profile endpoint
      let hasCompletedOnboarding = false;
      try {
        const businessProfile = await getMyBusinessProfile(session.token);
        hasCompletedOnboarding = businessProfile !== null;

        // Mark onboarding complete if business profile exists
        if (hasCompletedOnboarding) {
          markOnboardingComplete();
        }
      } catch {
        // Business profile fetch failed - assume not onboarded
        hasCompletedOnboarding = false;
      }

      // Step 4: Route based on role and onboarding status
      setTimeout(() => {
        const role = session.user?.role;

        // Staff always goes to shift dashboard
        if (role === "staff") {
          router.push("/dashboard/shift");
        }
        // Owner/Manager: check if onboarded
        else if (!hasCompletedOnboarding) {
          router.push("/onboarding/create-business");
        }
        // Already onboarded → go to dashboard
        else {
          router.push("/dashboard");
        }
      }, 800);
    } catch (err: unknown) {
      console.error("=== SIGN IN ERROR ===", err);
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as any).message === "string"
          ? (err as any).message
          : "Invalid email or password.";
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className={`w-full rounded-lg py-3 text-sm font-medium text-white transition flex items-center justify-center gap-2
                ${
                  isLoading
                    ? "bg-[#0F766E]/60 cursor-not-allowed"
                    : "bg-[#0F766E] hover:bg-[#0B5F58]"
                }
              `}
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
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