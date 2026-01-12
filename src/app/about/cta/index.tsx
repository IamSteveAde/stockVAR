"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Handshake, GraduationCap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WorkWithUs() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ================= BRAND GRADIENT ================= */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(95,59,134,0.08),
              rgba(97,171,187,0.08),
              rgba(188,200,215,0.18)
            )
          `,
        }}
      />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">
        <div className="grid gap-20 lg:grid-cols-12 items-center">
          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-7 max-w-3xl"
          >
            <span className="section-eyebrow">
              Work With Us
            </span>

            <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-black">
              Let’s create inclusive digital opportunity together
            </h2>

            <p className="mt-8 text-lg text-black/70 leading-relaxed max-w-2xl">
              Want to volunteer, mentor, or partner with the Digital Inclusion
              Initiative? We collaborate with individuals and organisations who
              share our commitment to access, equity, and practical outcomes.
              We’d love to hear from you.
            </p>

            {/* CTA */}
            <div className="mt-12">
              <a
                href="mailto:info@digitalinclusioninitiative.org"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-xs tracking-[0.3em] uppercase font-medium transition-all group"
                style={{
                  backgroundColor: "#5f3b86",
                  color: "#ffffff",
                }}
              >
                Email Us
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease }}
            className="lg:col-span-5"
          >
            <div className="space-y-10">
              <Engagement
                icon={Users}
                title="Volunteer"
                text="Support learners through training, facilitation, and community programmes."
              />

              <Engagement
                icon={GraduationCap}
                title="Mentor"
                text="Share your expertise to guide learners into confident, sustainable work."
              />

              <Engagement
                icon={Handshake}
                title="Partner"
                text="Collaborate on programmes, funding, or employer pathways with measurable impact."
              />
            </div>
          </motion.div>
        </div>

        {/* ================= SDG ALIGNMENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="mt-24 max-w-3xl"
        >
          <div className="h-[1px] w-full bg-gradient-to-r from-black/30 to-transparent mb-8" />

          <p className="text-sm text-black/65 leading-relaxed">
            Our work aligns with the United Nations Sustainable Development Goals:
            <span className="font-medium text-black">
              {" "}
              SDG 4 (Quality Education), SDG 5 (Gender Equality), SDG 8 (Decent
              Work), and SDG 9 (Industry, Innovation & Infrastructure).
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= ENGAGEMENT ITEM ================= */
function Engagement({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#bcc8d7]/40">
        <Icon size={20} className="text-black" />
      </div>

      <div>
        <h3 className="text-base font-semibold text-black mb-1">
          {title}
        </h3>
        <p className="text-sm text-black/65 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
