"use client";

import { Check } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden py-32" id="pricing">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#064E3B] to-[#111827]" />

      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#0F766E]/30 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-[#022C22]/40 blur-3xl" />

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
            Pricing
          </span>

          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            Simple pricing.
            <br />
            <span className="text-white/70">
              Built for serious operations.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/80">
            One plan. No hidden fees. Full access to StockVAR for your business.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto max-w-xl">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-xl">
            {/* Price */}
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-widest text-white/70">
                Monthly subscription
              </p>

              <div className="mt-4 flex items-end justify-center gap-2">
                <span className="text-5xl font-semibold text-white">
                  ₦50,000
                </span>
                <span className="mb-1 text-sm text-white/70">
                  / month
                </span>
              </div>
            </div>

            {/* Features */}
            <ul className="mb-10 space-y-4">
              {[
                "Daily stock recording and tracking",
                "VAR detection and reporting",
                "Staff and shift-level visibility",
                "Manager and owner access",
                "Unlimited stock items",
                "Email support",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E]/30 text-white">
                    <Check size={14} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

           {/* CTA */}
<div className="space-y-4">
  {/* Primary CTA */}
  <button className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F766E] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#0B5F58]">
    Get started now
  </button>

  {/* Secondary CTA */}
  <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10">
    Book a demo
  </button>

  <p className="pt-2 text-center text-xs text-white/60">
    No free trial. Pay to start immediately, or book a guided demo.
  </p>
</div>

          </div>
        </div>
      </div>
    </section>
  );
}
