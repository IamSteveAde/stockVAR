"use client";

import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#064E3B] to-[#111827]" />

      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#0F766E]/30 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-[#022C22]/40 blur-3xl" />

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            Take control of your stock.
            <br />
            <span className="text-white/70">
              Run VAR with confidence.
            </span>
          </h2>

          {/* Subtext */}
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            StockVAR gives you clarity over how stock is used, where losses
            happen, and what needs attention — without disrupting daily
            operations.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {/* Primary CTA */}
            <button className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#0F766E] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#0B5F58]">
              Get started now
              <ArrowRight size={16} />
            </button>

            {/* Secondary CTA */}
            <button className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10">
              Book a demo
            </button>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-white/60">
            No free trial. Monthly subscription. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
