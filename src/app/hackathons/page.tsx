"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Laptop,
  ArrowRight,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/* =====================================================
   UPCOMING HACKATHON SLIDES
===================================================== */
const upcomingHackathons = [
  {
    title: "AccessLab Innovation Sprint — April 2026",
    description:
      "A hands-on innovation sprint focused on solving last-mile access challenges around devices, data affordability, and digital inclusion.",
    details: [
      "Location: Yaba, Lagos",
      "Date: April 18–19, 2026",
    ],
    image: "/images/hackathons/upcoming-1.jpg",
  },
  {
    title: "Skills-to-Income Hackathon — July 2026",
    description:
      "Design pathways that help learners convert AI, Virtual Assistance, and Digital Marketing skills into sustainable income.",
    details: [
      "Location: Abuja",
      "Date: July 12–13, 2026",
    ],
    image: "/images/hackathons/upcoming-2.jpg",
  },
];

export default function HackathonsPage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tab !== "upcoming") return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % upcomingHackathons.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [tab]);

  return (
    <main className="bg-white overflow-hidden">

     {/* =====================================================
   HERO
===================================================== */}
<section className="relative min-h-[90vh] flex items-center overflow-hidden">

  {/* BRAND GRADIENT BACKDROP */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(
          60% 60% at 20% 20%,
          rgba(95,59,134,0.22),
          transparent 60%
        ),
        radial-gradient(
          50% 50% at 80% 30%,
          rgba(97,171,187,0.18),
          transparent 60%
        ),
        linear-gradient(
          180deg,
          #ffffff 0%,
          rgba(188,200,215,0.35) 100%
        )
      `,
    }}
  />

  {/* SUBTLE GRAIN */}
  <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

  {/* ORBITAL LINES */}
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-[#bcc8d7]/50"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full border border-[#5f3b86]/35"
    />
  </div>

  {/* CONTENT */}
  <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
    <div className="max-w-4xl">

      <span className="section-eyebrow">
        On-Site • Innovation Sprint • Community Impact
      </span>

      <h1 className="text-[clamp(2.8rem,6vw,4rem)] font-semibold leading-[1.05] mb-10">
        <span className="block text-black">
          Digital Inclusion
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]">
          Hackathons
        </span>
      </h1>

      <p className="max-w-2xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-black/70">
        Build practical solutions that help people join, learn, and earn
        in Nigeria’s digital economy. Teams design, prototype, and pitch
        inclusive ideas with mentorship and real pathways to pilots.
      </p>
    </div>
  </div>
</section>

      {/* =====================================================
         WHAT IS DII HACKATHONS
      ===================================================== */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid gap-20 lg:grid-cols-2">

          <div>
            <h2 className="text-3xl text-black/70 md:text-4xl font-semibold mb-10">
              What is DII Hackathons?
            </h2>

            <p className="text-black/70 leading-relaxed mb-12 max-w-xl">
              A 1–2 day innovation sprint where participants co-create
              solutions for digital inclusion. You ideate, prototype,
              test, and pitch — guided by mentors and judged by industry leaders.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <Info icon={Laptop} title="On-site Support">
                Venue, power & internet (American Corner), projector/AV, up to
                20 laptops available.
              </Info>

              <Info icon={Users} title="Experience">
                Meals & refreshments, live mentorship, music & energy by DJ Quake.
              </Info>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-black/70 font-semibold mb-8">Challenge Tracks</h3>
            <div className="space-y-6">
              <Track
                title="Access — Devices & Connectivity"
                desc="Match donated devices and data to learners, manage eligibility, and track impact."
              />
              <Track
                title="Learning — Skills to Income"
                desc="AI literacy, Virtual Assistance, and Digital Marketing pathways leading to jobs and gigs."
              />
              <Track
                title="Community — Civic & Inclusion Tools"
                desc="Reporting, accessibility, and micro-enterprise tools for underserved communities."
              />
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
         ELIGIBILITY & CODE OF CONDUCT
      ===================================================== */}
      <section className="bg-[#f8f9fc] py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid gap-20 lg:grid-cols-2">

          <div>
            <h3 className="text-2xl text-black/70 font-semibold mb-8">Eligibility</h3>
            <ul className="space-y-4 text-black/70">
              <li>• Open to students, early-career professionals & founders</li>
              <li>• Teams of 3–5 (solo applicants will be matched)</li>
              <li>• Basic laptop skills required</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-black/70 mb-8">Code of Conduct</h3>
            <p className="text-black/70">
              We foster an inclusive, respectful space. Harassment or plagiarism
              is not tolerated. Teams must own or have rights to any assets used.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
         UPCOMING / COMPLETED HACKATHONS
      ===================================================== */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">

          {/* Tabs */}
          <div className="flex gap-12 mb-20">
            {["upcoming", "completed"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`text-[11px] tracking-[0.45em] uppercase pb-3 ${
                  tab === t
                    ? "border-b-2 border-[#5f3b86] text-black"
                    : "text-black/40"
                }`}
              >
                {t === "upcoming" ? "Upcoming Hackathons" : "Completed Hackathons"}
              </button>
            ))}
          </div>

          {/* UPCOMING SLIDER */}
          {tab === "upcoming" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="grid gap-20 lg:grid-cols-2 items-center"
              >
                <div>
                  <h2 className="text-3xl font-semibold mb-8">
                    {upcomingHackathons[index].title}
                  </h2>

                  <p className="text-black/70 mb-8 max-w-xl">
                    {upcomingHackathons[index].description}
                  </p>

                  <ul className="space-y-2 text-black/70 mb-10">
                    {upcomingHackathons[index].details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>

                  <Link
                    href="https://docs.google.com/forms"
                    target="_blank"
                    className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-[#5f3b86] text-white text-xs tracking-[0.35em] uppercase"
                  >
                    Apply to Join Hackathon
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
                  <Image
                    src={upcomingHackathons[index].image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* COMPLETED */}
          {tab === "completed" && (
            <div className="grid gap-20 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-8">
                  BeatCode Hackathon — January 2026
                </h2>

                <p className="text-black/70 mb-8 max-w-xl">
                  A 2-day innovation challenge powered by DII and American Corner Ikeja,
                  bringing together developers, designers, and problem-solvers.
                </p>

                <ul className="space-y-2 text-black/70">
                  <li><strong>Location:</strong> American Corner Ikeja, Lagos</li>
                  <li><strong>Date:</strong> January 8–9, 2026</li>
                </ul>
              </div>

              <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
                <Image
                  src="/images/hero/flyer.webp"
                  alt="BeatCode Hackathon Flyer"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */
function Info({ icon: Icon, title, children }: any) {
  return (
    <div className="flex gap-4">
      <Icon size={100} className="text-[#5f3b86]" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-black/70">{children}</p>
      </div>
    </div>
  );
}

function Track({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-black/10 rounded-2xl p-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-black/70">{desc}</p>
    </div>
  );
}
