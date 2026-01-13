"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  MessageCircle,
  Layers,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CourseraOnboardingPage() {
  return (
    <main className="bg-white overflow-hidden">

 {/* =====================================================
   PROGRAM OVERVIEW — HERO STYLE
===================================================== */}
<section
  id="program-overview"
  className="relative min-h-[100vh] flex items-center overflow-hidden"
>
  {/* ================= BACKGROUND ================= */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(circle at top left, rgba(97,171,187,0.25), transparent 45%),
        linear-gradient(135deg, #2a123f 0%, #5f3b86 55%, #3a1d5d 100%)
      `,
    }}
  />

  {/* Soft orbital depth */}
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                 h-[760px] w-[760px] rounded-full border border-white/15"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                 h-[560px] w-[560px] rounded-full border border-white/10"
    />
  </div>

  {/* ================= CONTENT ================= */}
  <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl space-y-24">

    {/* ======= TOP HERO HEADER (NEW) ======= */}
    <div className="max-w-5xl">
      {/* Caption */}
      <span className="block text-[13px] tracking-[0.55em] uppercase text-[#d9c8ff] mb-8 py-10">
        Digital Inclusion Initiative × Coursera
      </span>

      {/* Main headline */}
      <h1 className="text-[clamp(1rem,3vw,2rem)] font-semibold leading-[1.05] text-white">
        Coursera Onboarding
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#61abbb] to-white">
          Unlocking Global Skills for Local Impact
        </span>
      </h1>
    </div>

    {/* ======= EXISTING PROGRAM OVERVIEW CONTENT ======= */}
    <div className="grid gap-20 lg:grid-cols-2 items-center">

      {/* LEFT — TEXT */}
      <div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-white">
          Program Overview
        </h2>

        <p className="text-white/90 leading-relaxed mb-6 max-w-xl">
          The DII × Coursera programme expands access to high-quality digital
          learning by combining Coursera’s global platform with DII’s local
          coordination, learner support, and programme oversight.
        </p>

        <p className="text-white/80 leading-relaxed max-w-xl">
          The programme goes beyond course access. Learners receive guided
          onboarding, orientation, progress monitoring, and structured support to
          ensure meaningful participation and completion.
        </p>
      </div>

      {/* RIGHT — FEATURES */}
      <div className="grid gap-10">
        <Feature
          icon={GraduationCap}
          title="Guided Learning Pathways"
          text="Curated Coursera course sequences aligned to employability and productivity outcomes."
          hero
        />
        <Feature
          icon={Layers}
          title="Structured Programme Design"
          text="Clear learning outcomes, onboarding, orientation, and learner monitoring."
          hero
        />
        <Feature
          icon={ShieldCheck}
          title="Quality & Accountability"
          text="Programme oversight ensures learning translates into real skills and confidence."
          hero
        />
      </div>

    </div>
  </div>
</section>
     
     {/* =====================================================
   TARGET BENEFICIARIES
===================================================== */}
<section className="py-24 bg-[#f9fafc]">
  <div className="container mx-auto px-6 lg:max-w-screen-xl">
    <h3 className="text-2xl md:text-3xl font-semibold mb-16 text-black/80">
      Target Beneficiaries
    </h3>

    <div className="grid gap-10 md:grid-cols-3">
      <Beneficiary
        icon={Users}
        title="Youth & Young Adults"
        text="Individuals seeking foundational or advanced digital skills for work and growth."
        variant="purple"
      />
      <Beneficiary
        icon={GraduationCap}
        title="Emerging Learners"
        text="Community members preparing for employment, entrepreneurship, or further study."
        variant="teal"
      />
      <Beneficiary
        icon={ShieldCheck}
        title="Underserved Groups"
        text="Learners with limited access to structured digital education opportunities."
        variant="lilac"
      />
    </div>
  </div>
</section>

      {/* =====================================================
         PARTNER ONBOARDING PROCESS
      ===================================================== */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <h3 className="text-2xl text-black md:text-3xl font-semibold mb-14">
            Partner Onboarding Process
          </h3>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProcessStep
              step="01"
              title="Partnership Confirmation"
              text="Once confirmed, DII aligns internally on scope, roles, and communication to ensure consistency."
              icon={Building2}
            />
            <ProcessStep
              step="02"
              title="Partner Information & Coordination"
              text="Partners complete a brief onboarding form covering contact details, liaison, and engagement preferences."
              icon={ClipboardList}
            />
            <ProcessStep
              step="03"
              title="Programme Orientation"
              text="A short orientation provides clarity on programme structure, objectives, and delivery approach."
              icon={GraduationCap}
            />
            <ProcessStep
              step="04"
              title="Activation & Engagement"
              text="Partners are formally activated and engaged at key milestones where their input adds value."
              icon={MessageCircle}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
         HOW TO ONBOARD AS A PARTNER
      ===================================================== */}
      <section className="py-15 bg-gradient-to-br from-[#2a123f] to-[#5f3b86] text-white">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid gap-16 lg:grid-cols-2">

          <div>
            <h3 className="text-3xl font-semibold mb-8">
              How to Onboard as a Partner
            </h3>

            <ul className="space-y-6 text-white/90 leading-relaxed max-w-xl">
              <li>
                <strong>Step 1:</strong> Express interest or confirm engagement
                following an introduction with the DII team.
              </li>
              <li>
                <strong>Step 2:</strong> Review programme objectives, structure,
                beneficiaries, and expected partner role.
              </li>
              <li>
                <strong>Step 3:</strong> Complete the partner onboarding form to
                support coordination and communication.
              </li>
              <li>
                <strong>Step 4:</strong> Partner activation and ongoing updates
                throughout programme delivery.
              </li>
            </ul>
          </div>

          <div className="flex items-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 w-full">
              <h4 className="text-xl font-semibold mb-6">
                Ready to Partner with DII?
              </h4>
              <p className="text-white/80 mb-8">
                Join us in delivering structured, impactful digital learning
                programmes with measurable outcomes.
              </p>
              <Link
                href="/partner"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#5f3b86] text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/90 transition"
              >
                Partner with DII
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
   FINAL CALL TO ACTION
===================================================== */}
<section className="relative py-15 overflow-hidden">
  {/* Background */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(circle at top right, rgba(97,171,187,0.25), transparent 45%),
        linear-gradient(135deg, #2a123f 0%, #5f3b86 60%, #3a1d5d 100%)
      `,
    }}
  />

  {/* Soft glow */}
  <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-white/10 blur-[140px]" />

  <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl text-center">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="sectionw-eyebrow"
    >
      Get Involved
    </motion.span>

    <h2 className="text-[clamp(2.4rem,5vw,3.4rem)] font-semibold text-white leading-tight mb-10">
      Turn Global Learning
      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#61abbb] to-white">
        into Real Opportunity
      </span>
    </h2>

    <p className="max-w-2xl mx-auto text-white/90 text-lg leading-relaxed mb-14">
      Whether you’re a partner looking to sponsor meaningful impact, or a learner
      seeking world-class skills with local support, the DII × Coursera programme
      is designed to deliver outcomes that matter.
    </p>

    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      {/* Partner CTA */}
      <Link
        href="/partner"
        className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-white text-[#5f3b86] text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/90 transition"
      >
        Partner with DII
        <ArrowRight size={16} />
      </Link>

      {/* Learner CTA */}
      <Link
        href="/programmes"
        className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl border border-white/40 text-white text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/10 transition"
      >
        Apply as a Learner
        <ArrowRight size={16} />
      </Link>
    </div>
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
  hero = false,
}: {
  icon: any;
  title: string;
  text: string;
  hero?: boolean;
}) {
  return (
    <div className="flex gap-5">
      <Icon
        size={32}
        className={hero ? "text-[#d9c8ff]" : "text-[#5f3b86]"}
      />
      <div>
        <h4 className={`font-semibold mb-2 ${hero ? "text-white" : "text-black"}`}>
          {title}
        </h4>
        <p className={`text-sm leading-relaxed ${hero ? "text-white/80" : "text-black/70"}`}>
          {text}
        </p>
      </div>
    </div>
  );
}

function Beneficiary({
  icon: Icon,
  title,
  text,
  variant,
}: {
  icon: any;
  title: string;
  text: string;
  variant: "purple" | "teal" | "lilac";
}) {
  const gradients = {
    purple:
      "bg-gradient-to-br from-[#5f3b86]/90 via-[#6f4aa0]/85 to-[#3a1d5d]/90",
    teal:
      "bg-gradient-to-br from-[#61abbb]/85 via-[#7cc5d1]/80 to-[#2f6f78]/90",
    lilac:
      "bg-gradient-to-br from-[#d9c8ff]/90 via-[#c3b2f5]/85 to-[#8a7cc7]/90",
  };

  return (
    <div
      className={`
        relative
        rounded-3xl
        p-10
        text-white
        shadow-[0_30px_80px_rgba(0,0,0,0.12)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-[0_40px_100px_rgba(0,0,0,0.18)]
        ${gradients[variant]}
      `}
    >
      {/* Soft glow */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10">
        <Icon size={36} className="mb-6 opacity-90" />

        <h4 className="text-xl font-semibold mb-4">
          {title}
        </h4>

        <p className="text-sm leading-relaxed text-white/90">
          {text}
        </p>
      </div>
    </div>
  );
}

function ProcessStep({ step, title, text, icon: Icon }: any) {
  return (
    <div className="border border-black/10 rounded-2xl p-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[#5f3b86] font-semibold">{step}</span>
        <Icon size={20} className="text-[#5f3b86]" />
      </div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <p className="text-sm text-black/70">{text}</p>
    </div>
  );
}
