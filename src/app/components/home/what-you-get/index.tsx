"use client";

import {
  ShieldCheck,
  BarChart2,
  Clock,
  TrendingUp,
} from "lucide-react";

const benefits = [
  {
    icon: BarChart2,
    title: "Clear stock accountability",
    description:
      "Understand exactly how stock items move each day, backed by proper records and structure.",
  },
  {
    icon: Clock,
    title: "See problems early",
    description:
      "Identify unusual stock loss before it becomes a habit or a major financial issue.",
  },
  {
    icon: ShieldCheck,
    title: "Fewer arguments, more facts",
    description:
      "Replace assumptions and tension with clear data everyone can agree on.",
  },
  {
    icon: TrendingUp,
    title: "Better control of food cost",
    description:
      "Reduce waste, improve planning, and protect your profit margins over time.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative overflow-hidden py-32" id="benefits">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#064E3B] to-[#111827]" />

      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#0F766E]/30 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#022C22]/40 blur-3xl" />

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
            What you get
          </span>

          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            Control your stock.
            <br />
            <span className="text-white/70">
              Protect your margins.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/80">
            StockVAR gives you clarity, discipline, and confidence in how your
            stock is managed — without disrupting daily operations.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:bg-white/10"
              >
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E]/40 to-[#022C22]/40 text-white shadow-lg">
                  <Icon size={24} />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-white/80">
                  {item.description}
                </p>

                {/* Subtle hover overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
