"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/* =====================================================
   TYPES
===================================================== */
type Hackathon = {
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  link?: string;
};

/* =====================================================
   DATA (THIS IS ALL YOU EDIT)
===================================================== */

// No upcoming hackathons for now
const upcomingHackathons: Hackathon[] = [];

/*
Example when ready:

const upcomingHackathons: Hackathon[] = [
  {
    title: "AccessLab Innovation Sprint",
    description: "A hands-on innovation sprint focused on last-mile access.",
    location: "Yaba, Lagos",
    date: "April 18–19, 2026",
    link: "https://docs.google.com/forms",
    image: "/images/hackathons/upcoming-1.jpg",
  },
];
*/

const completedHackathons: Hackathon[] = [
  {
    title: "BeatCode Hackathon",
    description:
      "A 2-day innovation challenge powered by DII and American Corner Ikeja, bringing together developers, designers, and problem-solvers.",
    location: "American Corner Ikeja, Lagos",
    date: "January 8–9, 2026",
    image: "/images/hero/flyer.webp",
  },
];

/* =====================================================
   PAGE
===================================================== */
export default function HackathonsPage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <main className="bg-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl">
            <span className="section-eyebrow">
              On-Site • Innovation Sprint • Community Impact
            </span>

            <h1 className="text-[clamp(2.8rem,6vw,4rem)] font-semibold leading-[1.05] mb-10">
              <span className="block text-black">Digital Inclusion</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]">
                Hackathons
              </span>
            </h1>

            <p className="max-w-2xl text-black/70">
              Build practical solutions that help people join, learn, and earn
              in Nigeria’s digital economy through focused innovation sprints.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LIST ================= */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">

          {/* Tabs */}
          <div className="flex gap-12 mb-24">
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
                {t === "upcoming"
                  ? "Upcoming Hackathons"
                  : "Completed Hackathons"}
              </button>
            ))}
          </div>

          {/* ================= UPCOMING ================= */}
          {tab === "upcoming" && (
            <>
              {upcomingHackathons.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-28">
                  {upcomingHackathons.map((hackathon, i) => (
                    <HackathonCard
                      key={i}
                      {...hackathon}
                      isUpcoming
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= COMPLETED ================= */}
          {tab === "completed" && (
            <div className="space-y-28">
              {completedHackathons.map((hackathon, i) => (
                <HackathonCard
                  key={i}
                  {...hackathon}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

/* =====================================================
   HACKATHON CARD
===================================================== */
function HackathonCard({
  title,
  description,
  location,
  date,
  image,
  link,
  isUpcoming,
}: Hackathon & { isUpcoming?: boolean }) {
  return (
    <article className="grid gap-16 lg:grid-cols-2 items-center border-t border-black/10 pt-16">
      <div>
        <h2 className="text-3xl font-semibold mb-6">{title}</h2>

        <p className="text-black/70 mb-8 max-w-xl">
          {description}
        </p>

        <ul className="space-y-2 text-black/70 mb-10">
          <li><strong>Location:</strong> {location}</li>
          <li><strong>Date:</strong> {date}</li>
        </ul>

        {isUpcoming && link && (
          <Link
            href={link}
            target="_blank"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#5f3b86] text-white text-xs tracking-[0.35em] uppercase"
          >
            Apply to Join
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </article>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="max-w-3xl mx-auto text-center py-32"
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-6">
        No upcoming hackathons yet
      </h2>

      <p className="text-black/70 max-w-xl mx-auto">
        We’re currently planning the next Digital Inclusion Hackathon.
        Check back soon for announcements and applications.
      </p>
    </motion.div>
  );
}
