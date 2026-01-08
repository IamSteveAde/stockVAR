"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type Programme = {
  id: number;
  category: "Career" | "Data" | "Creative Tech" | "Tech";
  status: "Now Open" | "Coming Soon";
  title: string;
  description: string;
  duration: string;
  mode: string;
};

const programmes: Programme[] = [
  {
    id: 1,
    category: "Career",
    status: "Now Open",
    title: "AI Career Essentials",
    description:
      "Gain practical insight into key AI terms, trends, and technologies so you can confidently apply artificial intelligence in everyday work and decision-making.",
    duration: "6 weeks",
    mode: "Hybrid",
  },
  {
    id: 2,
    category: "Career",
    status: "Coming Soon",
    title: "Virtual Assistant",
    description: "Gain the skills to become a Virtual Assistant.",
    duration: "10 weeks",
    mode: "Hybrid",
  },
  {
    id: 3,
    category: "Creative Tech",
    status: "Coming Soon",
    title: "Digital Marketer",
    description:
      "Learn core design principles and build a standout portfolio. Transform your creativity and master digital storytelling.",
    duration: "8 weeks",
    mode: "Virtual",
  },
  {
    id: 4,
    category: "Career",
    status: "Now Open",
    title: "Professional Foundations",
    description:
      "11 essential soft skills for employability: communication, teamwork, problem-solving, resilience, and more.",
    duration: "2 weeks",
    mode: "Hybrid",
  },
];

const filters = ["Show All", "Career", "Data", "Creative Tech", "Tech"] as const;

export default function ProgrammesPage() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>(
    "Show All"
  );

  const filteredProgrammes =
    activeFilter === "Show All"
      ? programmes
      : programmes.filter((p) => p.category === activeFilter);

  return (
    <main className="bg-white">
      {/* ================= INTRO ================= */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-3xl mb-16">
            <span className="block text-[11px] tracking-[0.55em] uppercase text-black/50 mb-6">
              Our Programmes
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-6">
              Practical, job-ready training
            </h1>
            <p className="text-black/70 text-lg leading-relaxed">
              Practical, job-ready training for women and underserved learners
              in Nigeria — with mentoring, career clinics, and device/data
              support where eligible.
            </p>
          </div>

          {/* ================= FILTER ================= */}
          <div className="flex flex-wrap gap-4 mb-20">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-6 py-3 rounded-full text-xs uppercase tracking-[0.25em]
                  transition
                  ${
                    activeFilter === filter
                      ? "bg-[#5f3b86] text-white"
                      : "bg-black/5 text-black/70 hover:bg-black/10"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* ================= PROGRAMME GRID ================= */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredProgrammes.map((programme) => (
              <motion.article
                key={programme.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="border border-black/10 rounded-3xl p-10 flex flex-col justify-between"
              >
                <div>
                  {/* Category + Status */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-black/50">
                      {programme.category}
                    </span>

                    <span
                      className={`text-xs px-4 py-1 rounded-full ${
                        programme.status === "Now Open"
                          ? "bg-[#61abbb]/20 text-[#61abbb]"
                          : "bg-black/10 text-black/50"
                      }`}
                    >
                      {programme.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl text-black/70 font-semibold mb-4">
                    {programme.title}
                  </h3>

                  {/* Description */}
                  <p className="text-black/70 leading-relaxed mb-8">
                    {programme.description}
                  </p>

                  {/* Meta */}
                  <div className="text-sm text-black/60 flex flex-wrap gap-2">
                    <span>Duration: {programme.duration}</span>
                    <span>•</span>
                    <span>Mode: {programme.mode}</span>
                  </div>
                </div>

                {/* CTAs */}
                {/* CTA */}
{programme.status === "Now Open" && (
  <div className="mt-10">
    <a
      href="https://docs.google.com/forms/d/1rF-cs2r7afbeCypC6604ZWkmFquLsB3bMDgCDf6V_VY/viewform?edit_requested=true"
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center justify-center gap-2
        w-full
        px-6 py-4
        rounded-xl
        bg-[#5f3b86]
        text-white
        text-xs
        tracking-[0.25em]
        uppercase
        hover:opacity-90
        transition
      "
    >
      Apply Now
      <ArrowRight size={14} />
    </a>
  </div>
)}

              </motion.article>
            ))}
          </div>

          {/* Empty state */}
          {filteredProgrammes.length === 0 && (
            <p className="mt-20 text-black/60">
              No programmes available under this category yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
