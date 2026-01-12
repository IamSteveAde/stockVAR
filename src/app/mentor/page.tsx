"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Users,
  Network,
  Sparkles,
  Brain,
  Briefcase,
  ClipboardCheck,
  Award,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MentorPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center">
        {/* Background system */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft grid */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(95,59,134,0.06)_1px,transparent_1px),linear-gradient(rgba(95,59,134,0.06)_1px,transparent_1px)] [background-size:60px_60px]" />

          {/* Orbits */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -right-48 h-[640px] w-[640px] rounded-full border border-[#5f3b86]/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-56 -left-56 h-[720px] w-[720px] rounded-full border border-[#61abbb]/20"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="block text-[14px] tracking-[0.55em] uppercase text-[#5f3b86] mb-10"
            >
              Now Recruiting Mentors
            </motion.span>

            <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,3.8rem)] max-w-3xl">
              Mentor with the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]">
                Digital Inclusion Initiative
              </span>
            </h1>

            <p className="mt-12 max-w-2xl text-[1.15rem] leading-relaxed text-black/70">
              Share your expertise to help women and underserved learners gain
              skills, confidence, and real pathways to work — across AI, Virtual
              Assistance, and Digital Marketing.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY MENTOR ================= */}
      <section className="py-26" style={{
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
          <div className="max-w-3xl mb-20">
            <span className="sectionw-eyebrow">
              Why Mentor with DII?
            </span>
            <h2 className="text-3xl text-white md:text-4xl font-semibold leading-tight">
              Purpose, leverage, and lasting impact
            </h2>
          </div>

          <div className="grid gap-16 md:grid-cols-3">
            <WhyCard
              icon={Sparkles}
              title="Transform Lives"
              text="Guide first-time learners into tech careers and entrepreneurship through practical, job-ready support."
            />
            <WhyCard
              icon={Network}
              title="Strengthen Ecosystems"
              text="Connect learners to internships, gigs, and opportunities across Nigeria’s digital economy."
            />
            <WhyCard
              icon={Users}
              title="Grow as a Leader"
              text="Build coaching, facilitation, and inclusive leadership skills while giving back."
            />
          </div>
        </div>
      </section>

      {/* ================= WHO SHOULD APPLY ================= */}
      <section className="bg-[#f9fafb] py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-3xl mb-16">
            <span className="section-eyebrow">
              Who Should Apply
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Experienced professionals ready to give back
            </h2>
          </div>

          <ul className="max-w-3xl space-y-6 text-black/70 text-lg">
            <li>• Professionals in AI, product, data, digital marketing, content, or operations</li>
            <li>• Experienced Virtual Assistants, project managers, or freelancers</li>
            <li>• HR, talent leaders, founders, and hiring managers</li>
            <li>• People passionate about inclusion, mentoring women, and community impact</li>
          </ul>
        </div>
      </section>

      {/* ================= MENTOR ROLES ================= */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-3xl mb-20">
            <span className="section-eyebrow">
              Mentor Roles
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Flexible roles, clear scope
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              icon={Brain}
              title="AI & Productivity Mentor"
              bullets={[
                "AI prompts, ethics & workflow automation",
                "Portfolio building & real-world use cases",
                "2–4 hrs/month (virtual)",
              ]}
            />

            <RoleCard
              icon={Briefcase}
              title="VA Career & Client Mentor"
              bullets={[
                "Proposals, pricing & client management",
                "Upwork / LinkedIn strategies",
                "2–4 hrs/month (virtual)",
              ]}
            />

            <RoleCard
              icon={ClipboardCheck}
              title="Marketing & Portfolio Mentor"
              bullets={[
                "SEO, social strategy & analytics basics",
                "Portfolio & case-study storytelling",
                "2–4 hrs/month (virtual)",
              ]}
            />

            <RoleCard
              icon={Users}
              title="CV, Interview & Career Clinics"
              bullets={[
                "Mock interviews & CV reviews",
                "LinkedIn optimisation & employer Q&As",
                "2 hrs/session (virtual / onsite)",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================= EXPECTATIONS & GAINS ================= */}
      <section className="bg-[#f9fafb] py-6">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid gap-20 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-black/70 mb-8">Expectations</h3>
            <ul className="space-y-5 text-black/70 text-lg">
              <li>• Commitment: typically 3 months</li>
              <li>• Orientation & safeguarding briefing required</li>
              <li>• Light reporting: session notes & feedback</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-black/70 mb-8">What You’ll Gain</h3>
            <ul className="space-y-5 text-black/70 text-lg">
              <li>• Impact recognition & references from DII</li>
              <li>• Access to partners & hiring pathways</li>
              <li>• Opportunities to speak, judge hackathons & co-design pilots</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= APPLY FORM ================= */}
      


    <section className="bg-[#f9fafb] py-24 md:py-32">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span className="section-eyebrow">
            Apply to Mentor
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-8">
            Share your expertise. Shape the future.
          </h2>

          {/* Body */}
          <p className="text-black/70 leading-relaxed mb-14 max-w-2xl">
            Complete our mentor application form to tell us about your experience,
            availability, and the areas you’d like to support.  
            Our team carefully reviews each application and typically responds
            within <strong>5–7 working days</strong>.
          </p>

          {/* CTA */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScBNWkZ2Osc7z366Y_WHhhyTPpo8yRKTVs5VqnB0LOHlZlh4A/viewform"
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
            Open Mentor Application
            <ArrowRight size={16} />
          </Link>

          {/* Helper note */}
          <p className="mt-6 text-xs text-black/50">
            Takes about 5 minutes to complete
          </p>
        </div>

      </div>
    </section>
 

    </main>
  );
}

/* ================= COMPONENTS ================= */

function WhyCard({ icon: Icon, title, text }: any) {
  return (
    <div className="border-t border-black/10 pt-8">
      <Icon className="h-6 w-6 text-white mb-6" />
      <h3 className="text-xl text-white/70 font-semibold mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}

function RoleCard({ icon: Icon, title, bullets }: any) {
  return (
    <div className="bg-white rounded-3xl p-10 border border-black/5 shadow-sm">
      <Icon className="h-7 w-7 text-[#61abbb] mb-6" />
      <h3 className="text-xl text-black/70 font-semibold mb-6">{title}</h3>
      <ul className="space-y-3 text-black/70">
        {bullets.map((b: string, i: number) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}
