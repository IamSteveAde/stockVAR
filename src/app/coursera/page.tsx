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
  <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">

  {/* =====================================================
      HERO HEADER
  ===================================================== */}
  <div className="max-w-5xl pt-28 pb-20">
    {/* Caption */}
    <span className="block text-[13px] tracking-[0.55em] uppercase text-[#d9c8ff] mb-8">
      Digital Inclusion Initiative × Coursera
    </span>

    {/* Main headline */}
    <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] text-white">
      DII × Coursera 
      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#61abbb] to-white mt-2">
        Programme Overview
      </span>
    </h1>
  </div>

  {/* =====================================================
      PROGRAM OVERVIEW CONTENT
  ===================================================== */}
  <div className="grid gap-24 lg:grid-cols-2 items-start pb-32">

    {/* LEFT — TEXT */}
    <div className="max-w-xl space-y-6">
      <p className="text-white/90 leading-relaxed">
        Through Coursera's Social Impact initiative, the Digital Inclusion Initiative (DII) has been awarded 1,000 learning licences to support individuals who are underserved, unemployed, underemployed, or seeking to build future-ready digital skills.
      </p>

      <p className="text-white/80 leading-relaxed">
        The programme combines Coursera's global learning platform with DII's local coordination and structured learner support. Participants receive guided onboarding, progress monitoring, and ongoing assistance to ensure meaningful participation and completion.
Delivered online with flexible scheduling, the programme scales through trusted community partners to maximize access, completion, and career outcomes.
      </p>
    </div>

    {/* RIGHT — FEATURES */}
    <div className="grid gap-12">
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
   ABOUT THE DII × COURSERA PROGRAMME
===================================================== 
<section className="relative py-28 overflow-hidden">
  {/* Background 
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(circle at top left, rgba(97,171,187,0.25), transparent 45%),
        linear-gradient(135deg, #2a123f 0%, #5f3b86 55%, #3a1d5d 100%)
      `,
    }}
  />

  {/* Soft accent glow 
  <div className="absolute -top-40 right-1/2 translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#61abbb]/10 blur-[120px]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    <div className="grid gap-20 lg:grid-cols-2 items-start">

      {/* LEFT — TEXT 
      <div className="max-w-xl">
        <span className="block text-[13px] tracking-[0.55em] uppercase font-semibold text-[#fff] mb-8">
          About the Programme
        </span>

        <h2 className="text-3xl md:text-4xl text-white font-semibold leading-tight mb-10">
          About the DII × Coursera Programme
        </h2>

        <p className="text-white/70 leading-relaxed mb-6">
          Through Coursera’s <strong>Social Impact initiative</strong>, the
          Digital Inclusion Initiative (DII) has been awarded{" "}
          <strong>1,000 learning licences</strong> to support individuals who are
          underserved, unemployed, underemployed, or seeking to build
          future-ready digital skills.
        </p>

        <p className="text-white/70 leading-relaxed">
          The programme is <strong>online-first, flexible</strong>, and designed
          to scale through trusted community partners — ensuring access,
          completion, and meaningful outcomes.
        </p>
      </div>

      {/* RIGHT — HIGHLIGHTS 
      <div className="grid gap-8">
        <div className="rounded-3xl bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-black/5">
          <h4 className="font-semibold text-black mb-3">
            Industry-Recognised Learning
          </h4>
          <p className="text-sm text-black/70 leading-relaxed">
            Access courses from leading global institutions and technology
            companies, trusted by employers worldwide.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-black/5">
          <h4 className="font-semibold text-black mb-3">
            Curated Learning Pathways
          </h4>
          <p className="text-sm text-black/70 leading-relaxed">
            Structured pathways across AI, data, digital literacy, business, and
            professional skills — aligned to employability and productivity.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-black/5">
          <h4 className="font-semibold text-black mb-3">
            Career-Strengthening Certificates
          </h4>
          <p className="text-sm text-black/70 leading-relaxed">
            Earn certificates that strengthen employability, entrepreneurship,
            and long-term career mobility.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>*/}

{/* =====================================================
   HOW THE PARTNERSHIP MODEL WORKS
===================================================== */}
<section className="relative py-28 overflow-hidden">
  {/* Background — SAME AS PREVIOUS SECTION */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(circle at top left, rgba(97,171,187,0.25), transparent 45%),
        linear-gradient(135deg, #2a123f 0%, #5f3b86 55%, #3a1d5d 100%)
      `,
    }}
  />

  {/* Soft accent glow */}
  <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#5f3b86]/10 blur-[120px]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    <div className="max-w-3xl mb-20">
      <span className="block text-[13px] tracking-[0.55em] uppercase font-semibold text-[#fff] mb-8">
        Partnership Model
      </span>

      <h2 className="text-3xl md:text-4xl font-semibold text-white/70 leading-tight">
        How the Partnership Model Works
      </h2>

      <p className="mt-6 text-white/70 leading-relaxed">
        The DII × Coursera programme is delivered through trusted community
        partners who provide local context, accountability, and learner support,
        while DII manages platform access, coordination, and impact reporting.
      </p>
    </div>

    <div className="grid gap-16 lg:grid-cols-2">

      {/* COMMUNITY DELIVERY PARTNER */}
      <div className="rounded-3xl bg-white p-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-black/5">
        <h3 className="text-2xl font-semibold mb-8 text-[#5f3b86]">
          As a DII Community Delivery Partner, your organisation will:
        </h3>

        <ul className="space-y-5 text-black/70 leading-relaxed">
          <li>• Identify and nominate eligible beneficiaries from your community</li>
          <li>• Support learner mobilisation and initial onboarding</li>
          <li>
            • Act as a local point of trust, encouragement, and accountability
            for learners
          </li>
          <li>
            • Collaborate with DII on light-touch learner tracking and impact
            reporting
          </li>
        </ul>
      </div>

      {/* DII RESPONSIBILITIES */}
      <div className="rounded-3xl bg-white p-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-black/5">
        <h3 className="text-2xl font-semibold mb-8 text-[#61abbb]">
          The Digital Inclusion Initiative (DII) will:
        </h3>

        <ul className="space-y-5 text-black/70 leading-relaxed">
          <li>
            • Provide access to Coursera licences and curated learning pathways
          </li>
          <li>
            • Manage the Coursera partnership, platform administration, and
            reporting
          </li>
          <li>
            • Onboard your organisation and nominated focal contact(s)
          </li>
          <li>
            • Provide onboarding materials, learner guidance, and programme
            support
          </li>
          <li>
            • Aggregate impact data for partners, donors, and reporting purposes
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>



     {/* =====================================================
   COMMUNITY DELIVERY PARTNER ONBOARDING PROCESS
===================================================== */}
<section className="relative py-28 overflow-hidden">
  {/* Background – neutral continuity */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8fc] to-white" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    {/* Header */}
    <div className="max-w-3xl mb-20">
      <span className="block text-[13px] tracking-[0.55em] uppercase font-semibold text-[#5f3b86] mb-8">
        Partner Onboarding
      </span>

      <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
        Community Delivery Partner Onboarding Process
      </h2>

      <p className="mt-6 text-black/70 leading-relaxed">
        The DII × Coursera onboarding process is designed to be simple,
        structured, and respectful of partner capacity — while ensuring
        clarity, accountability, and smooth learner activation.
      </p>
    </div>

    {/* STEPS GRID */}
    <div className="grid gap-12 lg:grid-cols-2">

      {/* STEP 1 */}
      <div className="rounded-3xl p-10 bg-gradient-to-br from-[#5f3b86]/10 via-[#6f4aa0]/10 to-[#3a1d5d]/10 border border-black/5">
        <h3 className="text-xl font-semibold mb-6 text-[#5f3b86]">
          1. Partner Confirmation
        </h3>

        <ul className="space-y-4 text-black/70 leading-relaxed">
          <li>
            • Complete the Partner Onboarding Form using the official DII link
          </li>
          <li>
            • Submit organisation details and nominate a focal contact person
          </li>
          <li>
            • Receive confirmation from the DII team once approved
          </li>
        </ul>

        <div className="mt-8">
         
        </div>
      </div>

      {/* STEP 2 */}
      <div className="rounded-3xl p-10 bg-gradient-to-br from-[#61abbb]/12 via-[#7cc5d1]/10 to-[#2f6f78]/12 border border-black/5">
        <h3 className="text-xl font-semibold mb-6 text-[#2f6f78]">
          2. Beneficiary Learner Information Submission
        </h3>

        <ul className="space-y-4 text-black/70 leading-relaxed">
          <li>
            • DII provides an Excel template and a secure upload link
          </li>
          <li>
            • Submitted beneficiaries must match allocated Coursera licences
          </li>
          <li>
            • Each beneficiary completes an individual onboarding form
          </li>
          <li>
            • Partners receive weekly updates on onboarding progress
          </li>
        </ul>
      </div>

      {/* STEP 3 */}
      <div className="rounded-3xl p-10 bg-gradient-to-br from-[#d9c8ff]/20 via-[#c3b2f5]/15 to-[#8a7cc7]/20 border border-black/5">
        <h3 className="text-xl font-semibold mb-6 text-[#5f3b86]">
          3. Licence Activation & Learner Onboarding
        </h3>

        <ul className="space-y-4 text-black/70 leading-relaxed">
          <li>
            • Approved beneficiaries attend a mandatory Coursera orientation
          </li>
          <li>
            • DII activates Coursera licences after orientation
          </li>
          <li>
            • Learners receive login credentials and begin learning
          </li>
        </ul>
      </div>

      {/* STEP 4 */}
      <div className="rounded-3xl p-10 bg-gradient-to-br from-[#5f3b86]/8 via-[#61abbb]/8 to-[#5f3b86]/8 border border-black/5">
        <h3 className="text-xl font-semibold mb-6 text-[#5f3b86]">
          4. Ongoing Engagement & Reporting
        </h3>

        <ul className="space-y-4 text-black/70 leading-relaxed">
          <li>
            • Periodic learner progress snapshots
          </li>
          <li>
            • Engagement insights and completion trends
          </li>
          <li>
            • Aggregated programme impact reporting for partners and donors
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>

      {/* =====================================================
   HOW TO ONBOARD AS A PARTNER — TIMELINE (FIXED WIDTH)
===================================================== */}
<section className="relative py-28 overflow-hidden text-white">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#2a123f] via-[#4a2a73] to-[#5f3b86]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_45%)]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    {/* Header */}
    <div className="max-w-3xl mb-20">
      <span className="block text-[13px] tracking-[0.55em] uppercase text-[#d9c8ff] mb-8">
        Partner Engagement
      </span>

      <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
        How to Onboard as a Partner
      </h3>

      <p className="mt-6 text-white/85 leading-relaxed">
        The onboarding journey is designed to be clear, lightweight, and
        respectful of partner capacity — while ensuring alignment, structure,
        and effective programme delivery.
      </p>
    </div>

    {/* Timeline wrapper */}
    <div className="relative space-y-20">
      {/* Vertical line */}
      <div className="hidden lg:block absolute left-[60px] top-0 h-full w-px bg-white/20" />

      <TimelineStep
        step="01"
        title="Express Interest & Initial Alignment"
        text="Partners confirm interest following an introduction or invitation from the DII team. Scope, intent, and alignment are clarified before activation."
      />

      <TimelineStep
        step="02"
        title="Programme Review"
        text="Partners receive and review programme objectives, structure, target beneficiaries, and expected levels of engagement."
      />

      <TimelineStep
        step="03"
        title="Partner Onboarding Form"
        text="A brief onboarding form is completed to confirm official contact details, nominate a focal person, and establish communication preferences."
      />

      <TimelineStep
        step="04"
        title="Partner Activation & Ongoing Updates"
        text="Once onboarded, partners are activated within the programme and receive periodic updates throughout implementation and impact reporting."
      />
    </div>
  </div>
</section>

      {/* =====================================================
   FINAL CALL TO ACTION
===================================================== */}
{/* =====================================================
   PROGRAMME DOCUMENTS & DOWNLOADS
===================================================== */}
<section className="relative py-24 overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#f7f8fc] via-white to-[#f3f0ff]" />
  <div className="absolute -top-40 right-1/3 h-[420px] w-[420px] rounded-full bg-[#5f3b86]/10 blur-[140px]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    {/* Header */}
    <div className="max-w-3xl mb-20">
      <span className="section-eyebrow mb-6">
        Resources
      </span>

      <h3 className="text-3xl text-black/70 md:text-4xl font-semibold leading-tight mb-6">
        Programme Documents & Downloads
      </h3>

      <p className="text-black/70 leading-relaxed">
        Access official onboarding materials for the DII × Coursera Social Impact
        Programme. These documents provide clarity on programme structure,
        partner roles, and onboarding processes.
      </p>
    </div>

    {/* Download cards */}
    <div className="grid gap-10 md:grid-cols-2">

      {/* Document 1 */}
      <DownloadCard
        title="Community Partner Onboarding Flow"
        subtitle="DII × Coursera Social Impact Programme"
        description="A high-level overview of how Community Delivery Partners engage with the programme — from confirmation through learner onboarding and reporting."
        href="/data/DII_x_Coursera_Partner_Onboarding_Flow.pdf"
        variant="purple"
      />

      {/* Document 2 */}
      <DownloadCard
        title="Community Partner Onboarding Guide"
        subtitle="DII × Coursera Social Impact Programme"
        description="A detailed guide outlining partner responsibilities, coordination steps, beneficiary submission, and ongoing engagement throughout programme delivery."
        href="/data/DII_x_Coursera_Partner_Onboarding_Guide.pdf"
        variant="teal"
      />

    </div>
  </div>
</section>



    </main>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function DownloadCard({
  title,
  subtitle,
  description,
  href,
  variant,
}: {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  variant: "purple" | "teal";
}) {
  const gradients = {
    purple:
      "bg-gradient-to-br from-[#5f3b86]/90 via-[#6f4aa0]/85 to-[#3a1d5d]/90",
    teal:
      "bg-gradient-to-br from-[#61abbb]/85 via-[#7cc5d1]/80 to-[#2f6f78]/90",
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
      {/* Soft overlay */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10">
        <span className="block text-[11px] tracking-[0.45em] uppercase text-white/70 mb-4">
          {subtitle}
        </span>

        <h4 className="text-2xl font-semibold mb-4">
          {title}
        </h4>

        <p className="text-white/85 leading-relaxed mb-10">
          {description}
        </p>

        <a
          href={href}
          download
          className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-[#5f3b86] text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/90 transition"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}

function TimelineStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-10 items-start">
      
      {/* Step indicator */}
      <div className="relative flex justify-center">
        <div className="h-12 w-12 rounded-full bg-white text-[#5f3b86] flex items-center justify-center font-semibold shadow-lg">
          {step}
        </div>
      </div>

      {/* Content — FORCE FULL WIDTH */}
      <div className="w-full max-w-none">
        <h4 className="text-xl text-white font-semibold mb-3">
          {title}
        </h4>

        <p className="text-white/85 leading-relaxed max-w-none">
          {text}
        </p>
      </div>
    </div>
  );
}

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
