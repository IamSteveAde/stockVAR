"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useBusiness } from "@/app/context/BusinessContext";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { clearSession, getSession } from "@/lib/api/auth";
import { createBusinessProfile } from "@/lib/api/business";
import { updateMyProfile } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";

import WelcomeStep from "./steps/WelcomeStep";
import EmailVerificationStep from "./steps/EmailVerificationStep";
import BusinessNameStep from "./steps/BusinessNameStep";
import BusinessTypeStep from "./steps/BusinessTypeStep";
import LocationStep from "./steps/LocationStep";
import StaffSizeStep from "./steps/StaffSizeStep";
import CompleteStep from "./steps/CompleteStep";
import {
  clearSignupEmail,
  clearSignupName,
  readSignupName,
  markOnboardingComplete,
} from "@/lib/onboarding";

/* ================= TYPES ================= */

type OnboardingForm = {
  businessName: string;
  businessType: string;
  city: string;
  role: "owner";
  staffSize: string;
};

const TOTAL_STEPS = 7;

/* ================= COMPONENT ================= */

export default function CreateBusinessWizard() {
  const router = useRouter();
  const { updateBusiness } = useBusiness();
  const { startTrial } = useSubscription();

  const [step, setStep] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get email from active session (user already signed up)
  const session = getSession();
  const signupEmail = session?.user?.email || "";

  const [form, setForm] = useState<OnboardingForm>({
    businessName: "",
    businessType: "",
    city: "",
    role: "owner",
    staffSize: "",
  });

  /* ================= NAVIGATION ================= */

  const next = () =>
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  const prev = () =>
    setStep((s) => Math.max(s - 1, 0));

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const updateForm = <K extends keyof OnboardingForm>(
    key: K,
    value: OnboardingForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= FINAL SUBMIT ================= */

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get current session
      const session = getSession();
      if (!session?.token) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/auth/login";
        return;
      }

      // Call backend to create/update business profile

      const businessProfile = await createBusinessProfile(
        {
          name: form.businessName,
          businessType: form.businessType,
          // city: form.city,
          dailyStaffSize: form.staffSize,
          location: form.city,
          // timezone: "Africa/Lagos",
        },
        session.token
      );

      // Update local context with backend data

      // Mark onboarding complete in local storage
      // This allows users to persist state across sessions
      markOnboardingComplete();
      clearSignupEmail();
      clearSignupName();

      // Start trial period
      // startTrial();

      toast.success("Business profile created successfully!");
      clearSession()

      // Redirect to signin
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
    } catch (error) {
      let message = "Failed to create business profile";

      if (error instanceof ApiError) {
        if (error.status !== 500) {
          message = error.message || error.data?.message || message;
        } else {
          message = "An internal server error occurred. Please try again later.";
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      setIsSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/hero/make.png')",
        }}
      />

      {/* Light overlay for brightness */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      {/* Wizard card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Progress */}
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F766E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {step === 0 && (
          <EmailVerificationStep
            email={signupEmail || undefined}
            confirmed={emailVerified}
            onConfirmedChange={setEmailVerified}
            onNext={next}
          />
        )}

        {step === 1 && <WelcomeStep onNext={next} />}

        {step === 2 && (
          <BusinessNameStep
            value={form.businessName}
            onChange={(v: string) =>
              updateForm("businessName", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 3 && (
          <BusinessTypeStep
            value={form.businessType}
            onChange={(v: string) =>
              updateForm("businessType", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 4 && (
          <LocationStep
            value={form.city}
            onChange={(v: string) =>
              updateForm("city", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 5 && (
          <StaffSizeStep
            value={form.staffSize}
            onChange={(v: string) =>
              updateForm("staffSize", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 6 && (
          <CompleteStep onFinish={handleFinish} isLoading={isSubmitting} />
        )}
      </div>
    </div>
  );
}
