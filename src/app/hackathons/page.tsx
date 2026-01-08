"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Lightbulb,
  Users,
  Laptop,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HackathonsPage() {
  return (
    <main className="bg-white overflow-hidden">

      {/* =====================================================
         HERO
      ===================================================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Orbital background lines */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-[#bcc8d7]/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full border border-[#5f3b86]/30"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="block text-[11px] tracking-[0.55em] uppercase text-black/60 mb-8"
            >
              On-Site • Innovation Sprint • Community Impact
            </motion.span>

            <h1 className="text-[clamp(2.8rem,6vw,4rem)] font-semibold leading-[1.05] text-black mb-10">
              Digital Inclusion Hackathons
            </h1>

            <p className="max-w-2xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-black/70">
              Build practical solutions that help people join, learn, and earn
              in Nigeria’s digital economy. Teams design, prototype, and pitch
              inclusive ideas — with mentorship and real pathways to pilots.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
         WHAT IS DII HACKATHONS
      ===================================================== */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="grid gap-20 lg:grid-cols-2 items-start">

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-10">
                What is DII Hackathons?
              </h2>

              <p className="text-black/70 leading-relaxed mb-12 max-w-xl">
                A 1–2 day innovation sprint where participants co-create
                solutions for digital inclusion. You will ideate, prototype,
                test, and pitch — guided by mentors and judged by industry
                leaders.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <Info icon={Laptop} title="On-site Support">
                  Venue, power & internet (American Corner), projector/AV, up to
                  20 laptops available.
                </Info>

                <Info icon={Users} title="Experience">
                  Meals & refreshments, live mentorship, music & energy by DJ
                  Quake.
                </Info>
              </div>
            </div>

            {/* Challenge Tracks */}
            <div>
              <h3 className="text-xl font-semibold mb-8">Challenge Tracks</h3>

              <div className="space-y-6">
                <Track
                  title="Access — Devices & Connectivity"
                  desc="Solutions that match donated devices/data to learners, manage eligibility, and track impact."
                />
                <Track
                  title="Learning — Skills to Income"
                  desc="AI literacy, Virtual Assistance, and Digital Marketing pathways that lead to gigs and jobs."
                />
                <Track
                  title="Community — Civic & Inclusion Tools"
                  desc="Reporting, accessibility, and micro-enterprise tools for underserved communities."
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
         ELIGIBILITY & CODE OF CONDUCT
      ===================================================== */}
      <section className="bg-[#f8f9fc] py-28">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid gap-20 lg:grid-cols-2">

          <div>
            <h3 className="text-2xl text-black/70 font-semibold mb-8">Eligibility</h3>
            <ul className="space-y-4 text-black/70 leading-relaxed">
              <li>• Open to students, early-career professionals & founders</li>
              <li>• Teams of 3–5 (solo applicants will be matched)</li>
              <li>• Basic laptop skills required (bring your device if possible)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl text-black/70 font-semibold mb-8">Code of Conduct</h3>
            <p className="text-black/70 leading-relaxed">
              We foster an inclusive, respectful space. Harassment or plagiarism
              is not tolerated. Teams must own or have rights to any assets used.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
         UPCOMING HACKATHON
      ===================================================== */}
      <section className="py-36">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">

          <div className="grid gap-20 lg:grid-cols-2 items-center">

            {/* LEFT — DETAILS */}
            <div>
              <span className="block text-[11px] tracking-[0.55em] uppercase text-black/50 mb-6">
                Upcoming Hackathon
              </span>

              <h2 className="text-3xl md:text-4xl font-semibold mb-8">
                BeatCode Hackathon — January 2026
              </h2>

              <p className="text-black/70 leading-relaxed mb-8 max-w-xl">
                The BeatCode Hackathon 2026, powered by the Digital Inclusion
                Initiative (DII) in partnership with American Corner Ikeja, is a
                2-day innovation challenge bringing together young developers,
                creators, and problem-solvers.
              </p>

              <p className="text-black/70 leading-relaxed mb-8 max-w-xl">
                Participants collaborate in teams, guided by experienced mentors
                and industry judges, building prototypes that address real-world
                challenges in education, accessibility, and community
                development.
              </p>

              <ul className="text-black/70 leading-relaxed space-y-2 mb-10">
                <li><strong>Location:</strong> American Corner Ikeja, Lagos</li>
                <li><strong>Date:</strong> January 8–9, 2026</li>
              </ul>

              <Link
                href="https://docs.google.com/forms"
                target="_blank"
                className="
                  inline-flex items-center gap-3
                  px-12 py-5
                  rounded-2xl
                  bg-[#5f3b86]
                  text-white
                  text-xs
                  tracking-[0.35em]
                  uppercase
                  hover:opacity-90
                  transition
                "
              >
                Apply to Join Hackathon
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* RIGHT — FLYER */}
            <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
              <Image
                src="/images/hero/flyer.webp"
                alt="BeatCode Hackathon Flyer"
                fill
                className="object-cover"
              />
            </div>

          </div>

          {/* LOGO */}
          <div className="mt-24 flex justify-center">
            <Image
              src="/images/hero/america.jpeg"
              alt="Digital Inclusion Initiative"
              width={140}
              height={40}
            />
          </div>

        </div>
      </section>
    </main>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function Info({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="text-[#5f3b86]" size={20} />
      <div>
        <h4 className="font-semibold text-black/70 mb-1">{title}</h4>
        <p className="text-sm text-black/70">{children}</p>
      </div>
    </div>
  );
}

function Track({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-black/10 rounded-2xl p-6 hover:border-[#5f3b86]/40 transition">
      <h4 className="font-semibold text-black/70 mb-2">{title}</h4>
      <p className="text-sm text-black/70">{desc}</p>
    </div>
  );
}
