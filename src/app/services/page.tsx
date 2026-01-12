"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Laptop,
  Wifi,
  Hammer,
  Users,
  ArrowRight,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <DIIAcademy />
      <DataDeviceBank />
      <Hackathons />
    </main>
  );
}

/* ======================================================
   HERO
====================================================== */
function ServicesHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Orbital brand system */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[820px] w-[820px] rounded-full border border-[#bcc8d7]/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[540px] w-[540px] rounded-full border border-[#5f3b86]/30"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="section-eyebrow"
          >
            Our Services
          </motion.span>

          <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,3.8rem)] text-black max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease }}
              className="block"
            >
              Empowering communities
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]"
            >
              through access, technology, and opportunity
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="mt-12 max-w-3xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-black/70"
          >
            At the Digital Inclusion Initiative, we believe digital access is a
            right — not a luxury. Our services help individuals and communities
            overcome barriers to technology through inclusive, practical, and
            sustainable solutions.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   DII ACADEMY
====================================================== */
function DIIAcademy() {
  return (
   <section
  className="relative py-15 md:py-15 overflow-hidden"
  style={{
    background: `
      radial-gradient(circle at top left, rgba(188,200,215,0.22) 0%, transparent 40%),
      radial-gradient(circle at bottom right, rgba(97,171,187,0.18) 0%, transparent 45%),
      linear-gradient(135deg, #2a123f 0%, #5f3b86 55%, #7b4db3 100%)
    `,
  }}
>
  {/* Soft atmospheric grain */}
  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:3px_3px]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    <div className="grid gap-20 lg:grid-cols-12 items-start">

      {/* LEFT */}
      <div className="lg:col-span-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
          DII Academy
        </h2>

        <p className="text-white/80 leading-relaxed max-w-xl mb-10">
          Job-ready bootcamps and clinics in AI &amp; Productivity, Virtual
          Assistance, and Digital Marketing — paired with mentoring, career
          clinics, and portfolio support for women and underserved learners.
        </p>

        <ul className="space-y-4 text-sm text-white/75">
          <li>• Hands-on, employer-informed curriculum</li>
          <li>• Mentors, career Q&amp;A, and mock interviews</li>
          <li>• Device and data support for eligible learners</li>
        </ul>

        <div className="mt-14">
          <Link
            href="/programmes"
            className="
              inline-flex items-center gap-3
              px-12 py-5
              rounded-2xl
              bg-white
              text-[#5f3b86]
              text-xs
              tracking-[0.35em]
              uppercase
              font-medium
              shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              hover:bg-white/90
              transition
            "
          >
            Explore Programmes
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* RIGHT CARD */}
      <ServiceCard
        icon={GraduationCap}
        title="Skills → Employment"
        text="Curriculum designed with employers to ensure relevance, confidence, and employability."
       
      />

    </div>
  </div>
</section>

  );
}

/* ======================================================
   DATA & DEVICE BANK
====================================================== */
function DataDeviceBank() {
  return (
    <section className="bg-[#f7f8fb] py-15 md:py-15">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid gap-20 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-8">
              DII Data & Device Bank
            </h2>

            <p className="text-black/70 leading-relaxed max-w-xl mb-10">
              We remove access barriers with refurbished devices, connectivity
              support, and classroom kits so learners can join, learn, and earn
              in the digital economy.
            </p>

            <h4 className="text-lg font-semibold text-black mb-4">
              Sponsor a School Tech Classroom
            </h4>

            <ul className="space-y-4 text-sm text-black/70">
              <li>• 10–30 laptops (refurbished or new)</li>
              <li>• Charging cart, projector or display</li>
              <li>• Secure data wiping & asset certificates via certified ITAD</li>
              <li>• Teacher onboarding & digital literacy pack</li>
            </ul>

            <div className="mt-12">
              <Link
                href="/donate-devices"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-black/30 text-xs tracking-[0.35em] uppercase hover:bg-black hover:text-white transition"
              >
                Donate Devices
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <ServiceCard
            icon={Laptop}
            title="Devices & Connectivity"
            text="Refurbished laptops, data bundles, and classroom kits for equitable access."
          />
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   HACKATHONS & BEATCODE
====================================================== */
function Hackathons() {
  return (
    <section
  className="relative py-15 md:py-15 overflow-hidden"
  style={{
    background: `
      radial-gradient(circle at top right, rgba(97,171,187,0.22) 0%, transparent 42%),
      radial-gradient(circle at bottom left, rgba(188,200,215,0.18) 0%, transparent 45%),
      linear-gradient(135deg, #241033 0%, #4f2f78 55%, #6b46a1 100%)
    `,
  }}
>
  {/* Subtle grain for depth */}
  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:3px_3px]" />

  <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
    <div className="grid gap-20 lg:grid-cols-12 items-start">

      {/* LEFT */}
      <div className="lg:col-span-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
          DII Hackathons &amp; BeatCode Club
        </h2>

        <p className="text-white/80 leading-relaxed max-w-xl mb-10">
          Fast-paced, problem-solving events where teams build solutions for
          real community challenges — mentored by industry experts and
          employers.
        </p>

        <ul className="space-y-4 text-sm text-white/75">
          <li>• High-energy build sprints (1–3 days)</li>
          <li>• Tracks: inclusion, education, micro-enterprise, civic tech</li>
          <li>• Prizes, mentorship, and pilot opportunities</li>
        </ul>

        <div className="mt-14">
          <Link
            href="/hackathons"
            className="
              inline-flex items-center gap-3
              px-12 py-5
              rounded-2xl
              bg-white
              text-[#5f3b86]
              text-xs
              tracking-[0.35em]
              uppercase
              font-medium
              shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              hover:bg-white/90
              transition
            "
          >
            Upcoming Hackathons
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* RIGHT CARD */}
      <ServiceCard
        icon={Hammer}
        title="Innovation in Action"
        text="Learners collaborate to design, prototype, and pitch real-world solutions with employer mentorship."
        
      />

    </div>
  </div>
</section>

  );
}

/* ======================================================
   SERVICE CARD
====================================================== */
function ServiceCard({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="lg:col-span-6">
      <div className="rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#61abbb]/20 mb-8">
          <Icon size={24} className="text-[#61abbb]" />
        </div>

        <h4 className="text-xl font-semibold text-black mb-4">
          {title}
        </h4>

        <p className="text-sm text-black/65 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
