"use client";

import { motion } from "framer-motion";
import { Calendar, Users, ExternalLink } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function EventsPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(95,59,134,0.06)_1px,transparent_1px),linear-gradient(rgba(95,59,134,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#bcc8d7]/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl ">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="block text-[11px] tracking-[0.55em] uppercase text-black/50 mb-10 my-20 "
            >
              Digital Inclusion Initiative • Community Events
            </motion.span>

            <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,3.8rem)] max-w-3xl">
              Digital inclusion{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]">
                what’s on & events
              </span>
            </h1>

            <p className="mt-12 max-w-2xl text-[1.15rem] leading-relaxed text-black/70">
              Review our upcoming conversations, workshops, and community
              sessions — and get involved in building a more inclusive digital
              future.
            </p>
          </div>
        </div>
      </section>

      {/* ================= EVENTS LIST ================= */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:max-w-screen-xl space-y-24">

          {/* EVENT 1 */}
          <EventCard
            day="Fri"
            month="Jan"
            date="16"
            title="Digital Skills to Digital Income: Freelancing Pathways"
            speakers="Blossom Ubochi"
            description="Freelancing is reshaping how people earn, and Africa is joining the movement. This hands-on webinar introduces participants to freelancing platforms, essential digital tools, and success stories from women building sustainable careers online."
            takeaways={[
              "How to identify marketable digital skills",
              "The best freelancing platforms for beginners",
              "Strategies to stand out and build a personal brand online",
            ]}
            time="2:00 PM (WAT)"
            duration="13:00 – 14:30"
            link="https://meet.google.com/mid-webu-ytg"
            tags={["#Freelancing", "#DigitalIncome", "#WomenInTech", "#DIIEvents"]}
          />

          {/* EVENT 2 */}
          <EventCard
            day="Fri"
            month="Feb"
            date="20"
            title="Building Digital Confidence: Beyond Skills to Mindset"
            speakers="Adeyinka Adeyefa & Maureen Ikeji"
            description="Confidence is the missing link between skills and success. This interactive session explores how to overcome self-doubt, imposter syndrome, and fear of technology, blending digital know-how with mindset tools."
            takeaways={[
              "Mindset techniques for confidence in digital spaces",
              "How to overcome limiting beliefs",
              "Stories of women who transitioned into tech with courage",
            ]}
            time="10:00 AM (WAT)"
            duration="09:00 – 10:30"
            link="https://meet.google.com/vsx-ytaz-ffw"
            tags={["#DigitalConfidence", "#MindsetMatters", "#WomenInTech", "#DIIEvents"]}
          />

          {/* EVENT 3 */}
          <EventCard
            day="Fri"
            month="Mar"
            date="20"
            title="Tech for Good: How Corporates Can Drive Inclusion"
            speakers="Seun Oyedeji"
            description="Corporate innovation and social responsibility go hand in hand. This conversation explores how businesses can leverage technology to empower underserved communities and create shared value."
            takeaways={[
              "Case studies on tech-driven corporate impact",
              "How to build effective CSR partnerships",
              "Insights from leaders driving inclusive growth in Africa",
            ]}
            time="10:00 AM (WAT)"
            duration="10:00 – 11:30"
            link="https://meet.google.com/hhb-wtrq-qik"
            tags={["#TechForGood", "#DigitalInclusion", "#CorporateImpact", "#DIIEvents"]}
          />

        </div>
      </section>
    </main>
  );
}

/* ================= EVENT CARD ================= */

function EventCard({
  day,
  month,
  date,
  title,
  speakers,
  description,
  takeaways,
  time,
  duration,
  link,
  tags,
}: any) {
  return (
    <article className="grid gap-12 lg:grid-cols-[120px_1fr] border-t border-black/10 pt-16">
      {/* Date */}
      <div className="text-center">
        <span className="block text-xs uppercase tracking-[0.3em] text-black/50">
          {day}
        </span>
        <span className="block text-sm text-black/60 mt-2">{month}</span>
        <span className="block text-4xl font-semibold mt-2">{date}</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
          {title}
        </h2>

        <div className="flex items-center gap-3 text-sm text-black/60 mb-6">
          <Users size={16} />
          <span>{speakers}</span>
        </div>

        <p className="text-black/70 leading-relaxed mb-8">
          {description}
        </p>

        <div className="mb-8">
          <span className="block text-xs tracking-[0.3em] uppercase text-black/50 mb-4">
            Key Takeaways
          </span>
          <ul className="space-y-3 text-black/70">
            {takeaways.map((t: string, i: number) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-6 items-center text-sm text-black/60 mb-10">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{time}</span>
          </div>
          <span>{duration}</span>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#5f3b86] text-white text-xs tracking-[0.3em] uppercase transition hover:opacity-90"
        >
          Join via Google Meet
          <ExternalLink size={14} />
        </a>

        <div className="mt-8 flex flex-wrap gap-3 text-xs text-black/50">
          {tags.map((tag: string) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
