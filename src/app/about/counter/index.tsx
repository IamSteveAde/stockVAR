"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurImpact() {
  return (
    <section className="relative bg-white">
      {/* ================= BRAND GRADIENT ================= */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(95,59,134,0.12),
              rgba(97,171,187,0.12),
              rgba(188,200,215,0.22)
            )
          `,
        }}
      />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-24 md:py-36">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4, once: true }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <span className="block text-[11px] tracking-[0.5em] uppercase text-black/60 mb-6">
            Our Impact (to date)
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight">
            Measured outcomes that reflect real progress
          </h2>
        </motion.div>

        {/* ================= COUNTERS ================= */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <Counter
            value={30}
            suffix="+"
            label="Learners Trained"
            accent="#5f3b86"
          />

          <Counter
            value={20}
            label="Devices Distributed"
            accent="#61abbb"
          />

          <Counter
            value={100}
            suffix="%"
            label="Placement / Income Outcomes*"
            accent="#5f3b86"
          />

          <Counter
            value={5}
            label="Active Partners"
            accent="#61abbb"
          />
        </div>

        {/* ================= FOOTNOTE ================= */}
        <p className="mt-14 text-xs text-black/60 max-w-xl">
          *Placement and income outcomes include employment, freelancing,
          paid internships, and entrepreneurial income reported by programme
          graduates.
        </p>
      </div>
    </section>
  );
}

/* ======================================================
   COUNTER — MOBILE SAFE, DESKTOP SAFE
====================================================== */
function Counter({
  value,
  label,
  suffix = "",
  accent,
}: {
  value: number;
  label: string;
  suffix?: string;
  accent: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, {
    amount: 0.3, // MOBILE SAFE
  });

  useEffect(() => {
    if (!numberRef.current) return;

    if (!isInView) {
      numberRef.current.textContent = "0";
      return;
    }

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        if (numberRef.current) {
          numberRef.current.textContent = Math.floor(latest).toString();
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.6, ease }}
      className="relative"
    >
      <div className="text-[clamp(2.8rem,5vw,3.6rem)] font-semibold text-black leading-none">
        <span ref={numberRef}>0</span>
        <span style={{ color: accent }}>{suffix}</span>
      </div>

      <div className="mt-3 text-sm text-black/70 tracking-wide">
        {label}
      </div>

      {/* Accent rule */}
      <div
        className="mt-6 h-[2px] w-12"
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}
