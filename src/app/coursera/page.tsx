"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CourseraOnboardingPage() {
  return (
    <main className="bg-white overflow-hidden">

      {/* =====================================================
         HERO
      ===================================================== */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at top left, rgba(97,171,187,0.25), transparent 45%),
              linear-gradient(135deg, #2a123f 0%, #5f3b86 55%, #3a1d5d 100%)
            `,
          }}
        />

        {/* Orbital lines */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full border border-white/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full border border-white/10"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="sectionw-eyebrow"
            >
              Digital Inclusion Initiative × Coursera
            </motion.span>

            <h1 className="text-[clamp(2.8rem,6vw,4rem)] font-semibold leading-[1.05] mb-10">
              Coursera Onboarding
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#61abbb] to-white">
                Unlocking Global Skills for Local Impact
              </span>
            </h1>

            <p className="max-w-2xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-white/90">
              DII’s Coursera onboarding turns global learning into local opportunity for women and underserved learners
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
         WHAT THIS PROGRAMME IS
      ===================================================== */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="grid gap-20 lg:grid-cols-2 items-start">

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-10">
                What is the Coursera Onboarding Programme?
              </h2>

              <p className="text-black/70 leading-relaxed mb-8 max-w-xl">
                The Coursera onboarding programme is DII’s structured pathway
                for enrolling learners into globally recognised courses while
                providing local support, mentoring, and accountability.
              </p>

              <p className="text-black/70 leading-relaxed max-w-xl">
                We don’t just hand out course access. We guide learners through
                onboarding, learning plans, completion, and translation of
                skills into employment, freelancing, or entrepreneurship.
              </p>
            </div>

            <div className="grid gap-8">
              <Feature
                icon={GraduationCap}
                title="Global Curriculum"
                text="Access to Coursera courses across technology, business, data, and AI."
              />
              <Feature
                icon={Users}
                title="Local Support"
                text="DII provides onboarding, study support, and mentoring to ensure completion."
              />
              <Feature
                icon={ShieldCheck}
                title="Trusted Outcomes"
                text="Learners gain certificates, confidence, and pathways to income."
              />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
         ONBOARD AS PARTNER / BENEFICIARY
      ===================================================== */}
      <section className="py-15 bg-[#f7f8fc]">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="grid gap-16 lg:grid-cols-2">

            {/* PARTNER */}
            <Card
              icon={Building2}
              title="Onboard as a Partner"
              text="Corporates, foundations, and institutions can support learner access to Coursera by sponsoring licences, cohorts, or community programmes."
              bullets={[
                "Advance ESG & SDG goals (4, 5, 8, 9)",
                "Sponsor learners or full cohorts",
                "Receive impact reporting & outcomes",
              ]}
              ctaLabel="Partner with DII"
              ctaLink="/partner"
              accent="purple"
            />

            {/* BENEFICIARY */}
            <Card
              icon={GraduationCap}
              title="Onboard as a Learner"
              text="If you are a woman or underserved learner seeking global skills and real opportunities, DII will guide you through Coursera onboarding."
              bullets={[
                "Guided course selection",
                "Structured onboarding & support",
                "Pathways to jobs, gigs, and careers",
              ]}
              ctaLabel="Apply as a Learner"
              ctaLink="/programmes"
              accent="teal"
            />

          </div>
        </div>
      </section>

      {/* =====================================================
         TRUST CLOSE
      ===================================================== */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl text-center max-w-3xl">
          <h3 className="text-2xl text-black/70 md:text-3xl font-semibold mb-8">
            Global learning. Local impact.
          </h3>

          <p className="text-black/70 leading-relaxed">
            The Digital Inclusion Initiative ensures that access to platforms
            like Coursera translates into real outcomes — skills, confidence,
            and opportunity — for those who need it most.
          </p>
        </div>
      </section>

    </main>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function Feature({
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
      <Icon size={32} className="text-[#5f3b86]" />
      <div>
        <h4 className="font-semibold text-black mb-2">{title}</h4>
        <p className="text-sm text-black/70">{text}</p>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  text,
  bullets,
  ctaLabel,
  ctaLink,
  accent,
}: {
  icon: any;
  title: string;
  text: string;
  bullets: string[];
  ctaLabel: string;
  ctaLink: string;
  accent: "purple" | "teal";
}) {
  const color =
    accent === "purple" ? "#5f3b86" : "#61abbb";

  return (
    <div className="relative bg-white rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
      <Icon size={36} style={{ color }} className="mb-6" />

      <h3 className="text-2xl text-black/70 font-semibold mb-6">{title}</h3>

      <p className="text-black/70 leading-relaxed mb-8">{text}</p>

      <ul className="space-y-3 text-sm text-black/70 mb-10">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>

      <Link
        href={ctaLink}
        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xs tracking-[0.35em] uppercase font-medium text-white transition hover:opacity-90"
        style={{ backgroundColor: color }}
      >
        {ctaLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
