"use client";

import { ClipboardList, TrendingDown, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: ClipboardList,
    title: "No clear record of daily usage",
    description:
      "Stock leaves the store every day, but there’s no reliable record showing what was used, during which shift, or by who.",
  },
  {
    icon: TrendingDown,
    title: "Stock runs out earlier than it should",
    description:
      "Items like rice, oil, and protein finish faster than expected, driving up food cost and disrupting purchasing plans.",
  },
  {
    icon: AlertTriangle,
    title: "Too much guesswork, not enough data",
    description:
      "Without accurate numbers, decisions are based on assumptions, leading to suspicion, tension, and repeat losses.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#0B3F3A] to-[#111827]" />

      {/* Soft glow accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#0F766E]/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#022C22]/40 blur-3xl" />

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section header */}
        <div className="mb-20 max-w-full">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
            The Problem
          </span>

          <h2 className="mt-6 text-3xl md:text-4xl w-full lg:text-5xl font-semibold leading-tight text-white">
            Stock loss rarely starts with theft.
            <br/>
            <span className="text-white/70">It starts with not knowing what was used.

            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {problems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:bg-white/10"
              >
                {/* Icon container */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E]/40 to-[#022C22]/40 text-white shadow-lg">
                  <Icon size={26} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-white/80">
                  {item.description}
                </p>

                {/* Hover glow */}
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
