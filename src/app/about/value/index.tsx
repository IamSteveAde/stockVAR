"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Handshake, ShieldCheck } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurValues() {
  return (
    <section className="relative overflow-hidden">
      {/* ================= BACKGROUND GRADIENT ================= */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(95,59,134,0.18),
              rgba(97,171,187,0.18),
              rgba(188,200,215,0.35)
            )
          `,
        }}
      />

      {/* Soft grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl mb-20"
        >
          <span className="section-eyebrow">
            Our Values
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-black">
            The principles that guide everything we do
          </h2>
        </motion.div>

        {/* Values grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={Users}
            title="Inclusion"
            text="We design with and for learners — accessible, affordable, and community-led."
            accent="#61abbb"
          />

          <ValueCard
            icon={Briefcase}
            title="Practicality"
            text="Hands-on training, real portfolios, and clear pathways to income."
            accent="#5f3b86"
          />

          <ValueCard
            icon={Handshake}
            title="Partnership"
            text="We co-create with employers, donors, and communities for lasting impact."
            accent="#61abbb"
          />

          <ValueCard
            icon={ShieldCheck}
            title="Accountability"
            text="Clear goals, data-driven decisions, and transparent reporting."
            accent="#5f3b86"
          />
        </div>
      </div>
    </section>
  );
}

/* ================= VALUE CARD ================= */
function ValueCard({
  icon: Icon,
  title,
  text,
  accent,
}: {
  icon: any;
  title: string;
  text: string;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="group relative rounded-2xl bg-white/70 backdrop-blur p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>

      <h3 className="text-lg font-semibold text-black mb-3">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-black/70">
        {text}
      </p>

      {/* Accent underline */}
      <div
        className="mt-6 h-[2px] w-12 transition-all group-hover:w-20"
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}
