"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useBusiness } from "@/app/context/BusinessContext";
import { useSubscription } from "@/app/context/SubscriptionContext";

import WelcomeStep from "./steps/WelcomeStep";
import BusinessNameStep from "./steps/BusinessNameStep";
import BusinessTypeStep from "./steps/BusinessTypeStep";
import LocationStep from "./steps/LocationStep";
import RoleStep from "./steps/RoleStep";
import StaffSizeStep from "./steps/StaffSizeStep";
import CompleteStep from "./steps/CompleteStep";

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

  const handleFinish = () => {
    updateBusiness({
      name: form.businessName,
      type: form.businessType,
      city: form.city,
      timezone: "Africa/Lagos",
      createdAt: new Date().toISOString(),
    });

    startTrial();
    router.push("/dashboard");
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

        {step === 0 && <WelcomeStep onNext={next} />}

        {step === 1 && (
          <BusinessNameStep
            value={form.businessName}
            onChange={(v: string) =>
              updateForm("businessName", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 2 && (
          <BusinessTypeStep
            value={form.businessType}
            onChange={(v: string) =>
              updateForm("businessType", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 3 && (
          <LocationStep
            value={form.city}
            onChange={(v: string) =>
              updateForm("city", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        

        {step === 4 && (
          <StaffSizeStep
            value={form.staffSize}
            onChange={(v: string) =>
              updateForm("staffSize", v)
            }
            onNext={next}
            onPrev={prev}
          />
        )}

        {step === 5 && (
          <CompleteStep onFinish={handleFinish} />
        )}
      </div>
    </div>
  );
}
