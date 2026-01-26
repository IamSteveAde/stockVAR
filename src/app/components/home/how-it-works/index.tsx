"use client";

import { Boxes, PenLine, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Record your stock",
    description:
      "Count and record your stock items at the start and end of each day or shift.",
    icon: Boxes,
  },
  {
    step: "02",
    title: "Log stock usage",
    description:
      "Whenever stock leaves storage, staff record what was taken and why.",
    icon: PenLine,
  },
  {
    step: "03",
    title: "Run VAR",
    description:
      "StockVAR compares records and highlights unexplained differences automatically.",
    icon: BarChart3,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-[#F9FAFB] py-28 overflow-hidden" id="how-it-works">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(17,24,39,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section header */}
        <div className="mb-24 max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-[#6B7280]">
            How it works
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight">
            A simple process.
            <br />
            <span className="text-[#6B7280]">
              Built for daily restaurant operations.
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative space-y-20">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-[#0F766E]/40 via-[#0F766E]/20 to-transparent md:left-1/2" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Content card */}
                <div
                  className={`relative z-10 w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm ${
                    isLeft ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-[#6B7280]">
                      Step {item.step}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-[#111827]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#374151]">
                    {item.description}
                  </p>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-6 top-8 z-20 h-4 w-4 rounded-full bg-[#0F766E] md:left-1/2 md:-translate-x-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
