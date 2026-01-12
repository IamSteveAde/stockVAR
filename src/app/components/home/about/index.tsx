"use client";

import { motion } from "framer-motion";
import {
  HeartHandshake,
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Donate Today",
    headline: "Support Digital Inclusion Initiative",
    description:
      "Your donation today could help transform someone’s life through digital access, skills, and opportunity. Together, we can fix the digital divide — for good.",
    cta: "Donate Now",
    href: "/donate",
    icon: HeartHandshake,
    accent: "#61abbb",
  },
  {
    title: "Volunteer",
    headline: "Volunteer with Digital Inclusion Initiative",
    description:
      "Join our team of volunteers and make a difference in your community. Whether it’s a few hours a week or a few hours a month, your time and skills matter.",
    cta: "Become a Volunteer",
    href: "/volunteer",
    icon: Users,
    accent: "#5f3b86",
  },
  {
    title: "Events",
    headline: "Attend Our Events",
    description:
      "We host fundraisers, community outreach programs, and educational seminars throughout the year. Stay engaged and be part of the movement.",
    cta: "View Events",
    href: "/events",
    icon: CalendarDays,
    accent: "#bcc8d7",
  },
];

export default function SupportSection() {
  return (
    <section className="relative bg-white py-12">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <span className="section-eyebrow">
            Get Involved
          </span>
          <h2 className="text-4xl md:text-5xl font-light leading-tight text-black">
            Support Digital Inclusion Initiative Today
          </h2>
          <p className="mt-6 text-black/60 max-w-xl leading-relaxed">
            Do a good thing today. Your support helps expand access, build skills,
            and unlock opportunities through digital inclusion.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-10 md:grid-cols-3">
          {actions.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative rounded-3xl p-10 border border-black/5 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                {/* Accent Glow */}
                <div
                  className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-30"
                  style={{ backgroundColor: item.accent }}
                />

                {/* Icon */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-8"
                  style={{ backgroundColor: `${item.accent}22` }}
                >
                  <Icon size={22} style={{ color: item.accent }} />
                </div>

                {/* Text */}
                <span className="block text-[11px] tracking-[0.35em] uppercase text-black/40 mb-3">
                  {item.title}
                </span>

                <h3 className="text-xl font-medium text-black mb-4 leading-snug">
                  {item.headline}
                </h3>

                <p className="text-black/60 leading-relaxed mb-8">
                  {item.description}
                </p>

                {/* CTA */}
                <a
                  href={item.href}
                  className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-medium transition-all group"
                  style={{ color: item.accent }}
                >
                  {item.cta}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
