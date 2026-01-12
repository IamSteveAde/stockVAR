"use client";

import { motion } from "framer-motion";
import OurStory from "./ourstory";
import Value from "./value";
import Counter from "./counter";
import CTA from "./cta";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutPage() {
  return (
    <main>
      {/* ================= ABOUT HERO ================= */}
      <section className="relative min-h-screen overflow-hidden bg-white flex items-center">
        {/* ================== DYNAMIC BRAND SYSTEM ================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central orbital field */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Outer orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="relative h-[620px] w-[620px] rounded-full border border-[#bcc8d7]/40"
            >
              <div className="absolute top-[-6px] left-1/2 h-3 w-3 rounded-full bg-[#61abbb]" />
            </motion.div>

            {/* Inner orbit */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[90px] rounded-full border border-[#5f3b86]/40"
            >
              <div className="absolute bottom-[-6px] right-1/3 h-3 w-3 rounded-full bg-[#5f3b86]" />
            </motion.div>
          </div>

          {/* Ambient mist wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#bcc8d7]/10 via-transparent to-transparent" />

          {/* Editorial grain */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
        </div>

        {/* ================== CONTENT ================== */}
        <div className="relative z-10 w-full py-16">
          <div className="container mx-auto px-6 lg:max-w-screen-xl">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease }}
                className="section-eyebrow"
              >
                About the Initiative
              </motion.span>

              {/* Headline */}
              <h1
                className="
                  font-semibold
                  leading-[1.05]
                  text-[clamp(2.8rem,6vw,3.8rem)]
                  text-black
                  max-w-3xl
                "
              >
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.9, ease }}
                  className="block"
                >
                  Digital inclusion
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.9, ease }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]"
                >
                  begins with access
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.9, ease }}
                  className="block"
                >
                  and leads to opportunity.
                </motion.span>
              </h1>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8, ease }}
                className="
                  mt-14
                  max-w-3xl
                  text-[clamp(1.05rem,1.5vw,1.3rem)]
                  leading-relaxed
                  text-black/70
                "
              >
                The Digital Inclusion Initiative is a social-impact organisation
                advancing access to devices, data, and job-ready digital skills —
                ensuring that women and underserved communities can participate
                fully in the digital economy.
              </motion.p>

              {/* Signature rule */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "220px" }}
                transition={{ delay: 1.35, duration: 1, ease }}
                className="mt-24 h-[2px] bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <OurStory />
      <Value />
      <Counter />
      <CTA />

    </main>
  );
}
