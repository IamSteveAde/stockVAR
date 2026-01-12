"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

export default function DonateHero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center ">
      {/* ================= BACKGROUND IMAGE WITH ZOOM ================= */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{
          duration: 40,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/donate/donate-hero.jpg')", // ← replace with your image
          }}
        />
      </motion.div>

      {/* ================= BRAND OVERLAY ================= */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              120deg,
              rgba(95,59,134,0.85),
              rgba(95,59,134,0.65),
              rgba(97,171,187,0.45)
            )
          `,
        }}
      />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 w-full py-16">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl text-white">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="sectionw-eyebrow"
            >
              Donate
            </motion.span>

            {/* Headline */}
            <h1
              className="
                font-semibold
                leading-[1.05]
                text-[clamp(2.6rem,6vw,3.8rem)]
                max-w-3xl
              "
            >
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9, ease }}
                className="block"
              >
                Donate to the
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9, ease }}
                className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#61abbb] to-white"
              >
                Digital Inclusion Initiative
              </motion.span>
            </h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease }}
              className="mt-12 max-w-2xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-white/90"
            >
              Your gift powers access to devices, data, and job-ready digital
              skills — helping women and underserved learners across Africa
              participate fully in the digital economy.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.8, ease }}
              className="mt-16"
            >
              <Link
                href="#donate-options"
                className="
                  inline-flex items-center justify-center
                  px-12 py-5
                  rounded-2xl
                  bg-white
                  text-[#5f3b86]
                  text-xs
                  tracking-[0.35em]
                  uppercase
                  font-medium
                  transition-all
                  hover:bg-white/90
                "
              >
                Make a Donation
              </Link>
            </motion.div>

            {/* Signature rule */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "240px" }}
              transition={{ delay: 1.6, duration: 1, ease }}
              className="mt-24 h-[2px] bg-gradient-to-r from-white via-[#61abbb] to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
