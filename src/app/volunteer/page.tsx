"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Users,
  Network,
  GraduationCap,
  Laptop,
  HeartHandshake,
  Megaphone,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function VolunteerPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">
        {/* Background system */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Flow lines */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(95,59,134,0.06)_1px,transparent_1px),linear-gradient(rgba(95,59,134,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

          {/* Orbits */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full border border-[#5f3b86]/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -left-48 h-[620px] w-[620px] rounded-full border border-[#61abbb]/20"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="section-eyebrow"
            >
              Now Recruiting Volunteers
            </motion.span>

            <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,3.8rem)] max-w-3xl">
              Volunteer with the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]">
                Digital Inclusion Initiative
              </span>
            </h1>

            <p className="mt-12 max-w-2xl text-[1.15rem] leading-relaxed text-black/70">
              Help bridge Nigeria’s digital divide. Mentor learners, support
              trainings, run community events, and power inclusive access to
              devices, data, and job-ready digital skills.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY VOLUNTEER ================= */}
      <section
  className="
    relative
    py-24
    overflow-hidden
    text-white
  "
  style={{
    background: `
      radial-gradient(
        circle at top left,
        rgba(155,120,210,0.25),
        transparent 45%
      ),
      linear-gradient(
        135deg,
        #2a123f 0%,
        #5f3b86 55%,
        #7b5bb3 100%
      )
    `,
  }}
>
  {/* Subtle grain */}
  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />

  <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
    {/* Header */}
    <div className="max-w-3xl mb-20">
      <span className="sectionw-eyebrow">
        Why Volunteer with DII?
      </span>

      <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-white mt-6">
        Purposeful contribution with measurable impact
      </h2>
    </div>

    {/* Cards */}
    <div className="grid gap-16 md:grid-cols-3 text-white">
      <WhyCard
        icon={HeartHandshake}
        title="Real Impact"
        text="Enable women and underserved communities to access devices, data, and work-ready digital skills."
      />
      <WhyCard
        icon={Network}
        title="Grow Your Network"
        text="Collaborate with tech partners, hubs, trainers, and mentors across Nigeria’s digital ecosystem."
      />
      <WhyCard
        icon={GraduationCap}
        title="Build Your Skills"
        text="Gain hands-on experience in facilitation, community management, curriculum delivery, and events."
      />
    </div>
  </div>
</section>

      {/* ================= ROLES ================= */}
      <section className="relative bg-[#f9fafb] py-15">
        {/* Subtle orbit lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(95,59,134,0.06),transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-3xl mb-20">
            <span className="section-eyebrow">
              Volunteer Roles
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Flexible roles. Clear expectations.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              icon={GraduationCap}
              title="Digital Skills Trainer"
              category="Training"
              bullets={[
                "Deliver AI, Virtual Assistant or Digital Marketing modules",
                "Support practical projects & assessments",
                "4–8 hrs/week (hybrid / onsite)",
              ]}
            />

            <RoleCard
              icon={Users}
              title="Career & Employability Mentor"
              category="Mentoring"
              bullets={[
                "Coach learners on portfolios & interviews",
                "Host freelancing & LinkedIn clinics",
                "2–4 hrs/month (virtual)",
              ]}
            />

            <RoleCard
              icon={HeartHandshake}
              title="Programme & Events Support"
              category="Operations"
              bullets={[
                "Class coordination & logistics",
                "Support hackathons & outreach",
                "Flexible (project-based)",
              ]}
            />

            <RoleCard
              icon={Laptop}
              title="IT & Device Bank Support"
              category="Tech"
              bullets={[
                "Device intake & refurbishment",
                "SIM/data bank support",
                "Flexible (onsite)",
              ]}
            />

            <RoleCard
              icon={Megaphone}
              title="Content & Social Media"
              category="Comms"
              bullets={[
                "Create stories & reels",
                "Amplify campaigns & events",
                "2–4 hrs/week (remote)",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-3xl">
            <span className="section-eyebrow">
              Commitment & Onboarding
            </span>

            <ul className="space-y-6 text-black/70 text-lg">
              <li>• Minimum recommended commitment: <strong>3 months</strong></li>
              <li>• Orientation & safeguarding briefing required</li>
              <li>• References may be requested for trainer/mentor roles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FORM ================= */}
     <section className="py-24 md:py-15" style={{
    background: `
      radial-gradient(
        circle at top left,
        rgba(155,120,210,0.25),
        transparent 45%
      ),
      linear-gradient(
        135deg,
        #2a123f 0%,
        #5f3b86 55%,
        #7b5bb3 100%
      )
    `,
  }}>
      <div className="container mx-auto px-6 lg:max-w-screen-xl">

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span className="sectionw-eyebrow">
            Apply to Volunteer
          </span>

          {/* Heading */}
          <h2 className="text-3xl text-white md:text-4xl font-semibold leading-tight mb-8">
            Tell us how you’d like to contribute
          </h2>

          {/* Body */}
          <p className="text-white/70 leading-relaxed mb-14 max-w-2xl">
            Complete our short application form to let us know your skills,
            availability, and the role you’re most interested in.  
            Our team will review your submission and respond within a few
            working days.
          </p>

          {/* CTA */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSe0LoAQpllbIiGsMmiEX9FQj064iRz2XTLSHppTAKSIsBbVxg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-4
              px-12 py-5
              rounded-2xl
              bg-[#5f3b86]
              text-white
              text-xs
              tracking-[0.35em]
              uppercase
              font-medium
              transition-all
              hover:bg-[#4e2f72]
            "
          >
            Open Volunteer Application
            <ArrowRight size={16} />
          </Link>

          {/* Helper note */}
          <p className="mt-6 text-xs text-white/50">
            Takes about 5 minutes to complete
          </p>
        </div>

      </div>
    </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function WhyCard({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-black/10 pt-8">
      <Icon className="h-6 w-6 text-white mb-6" />
      <h3 className="text-xl text-white/70  font-semibold mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  category,
  bullets,
}: {
  icon: any;
  title: string;
  category: string;
  bullets: string[];
}) {
  return (
    <div className="bg-white rounded-3xl p-10 border border-black/5 shadow-sm">
      <Icon className="h-7 w-7 text-[#61abbb] mb-6" />
      <span className="block text-xs tracking-[0.3em] uppercase text-[#5f3b86] mb-3">
        {category}
      </span>
      <h3 className="text-xl text-black/70 font-semibold mb-6">{title}</h3>
      <ul className="space-y-3 text-black/70">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}
