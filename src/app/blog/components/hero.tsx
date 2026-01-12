"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-white h-[100vh]">
      {/* Subtle brand atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#5f3b86]/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-[#61abbb]/12 blur-[160px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-20 md:py-15">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="section-eyebrow"
          >
            Digital Inclusion Initiative • Community & Impact
          </motion.span>

          {/* Headline */}
          <h1
            className="
              font-semibold
              leading-[1.05]
              text-[clamp(2.6rem,6vw,3.8rem)]
              text-black
              max-w-3xl
            "
          >
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease }}
              className="block"
            >
              Digital inclusion stories
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]"
            >
              & case studies
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="
              mt-12
              max-w-3xl
              text-[clamp(1.05rem,1.4vw,1.25rem)]
              leading-relaxed
              text-black/70
            "
          >
            Read stories from individuals who have crossed the digital divide,
            alongside case studies from our corporate device donors and partners
            creating measurable impact across communities.
          </motion.p>

          {/* Editorial rule */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "220px" }}
            transition={{ delay: 1.2, duration: 1, ease }}
            className="mt-20 h-[2px] bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
