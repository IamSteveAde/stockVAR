"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import WelcomeStep from "./steps/WelcomeStep";
import BusinessNameStep from "./steps/BusinessNameStep";
import BusinessTypeStep from "./steps/BusinessTypeStep";
import LocationStep from "./steps/LocationStep";
import RoleStep from "./steps/RoleStep";
import StaffSizeStep from "./steps/StaffSizeStep";
import CompleteStep from "./steps/CompleteStep";

const TOTAL_STEPS = 7;

export default function CreateBusinessWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    city: "",
    role: "owner",
    staffSize: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const updateForm = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
      {/* Progress */}
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0F766E] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      {step === 0 && <WelcomeStep onNext={next} />}
      {step === 1 && (
        <BusinessNameStep
          value={form.businessName}
          onChange={(v) => updateForm("businessName", v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {step === 2 && (
        <BusinessTypeStep
          value={form.businessType}
          onChange={(v) => updateForm("businessType", v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {step === 3 && (
        <LocationStep
          value={form.city}
          onChange={(v) => updateForm("city", v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {step === 4 && (
        <RoleStep
          value={form.role}
          onChange={(v) => updateForm("role", v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {step === 5 && (
        <StaffSizeStep
          value={form.staffSize}
          onChange={(v) => updateForm("staffSize", v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {step === 6 && <CompleteStep onFinish={() => router.push("/dashboard")} />}
    </div>
  );
}
