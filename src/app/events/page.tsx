"use client";

import { motion } from "framer-motion";
import { Calendar, Users, ExternalLink } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function EventsPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(95,59,134,0.06)_1px,transparent_1px),linear-gradient(rgba(95,59,134,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#bcc8d7]/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="block text-[14px] tracking-[0.55em] uppercase text-[#5f3b86] mb-10 my-20"
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
              sessions, and get involved in building a more inclusive digital
              future.
            </p>
          </div>
        </div>
      </section>

      {/* ================= EVENTS LIST ================= */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl space-y-28">

          
          <EventCard
            day="Fri"
            month="Feb"
            date="20"
            title="Building Digital Confidence: Beyond Skills to Mindset"
            speakers="Adeyinka Adeyefa & Maureen Ikeji"
            image="/images/hero/building.jpeg"
            description="Confidence is the missing link between skills and success. This interactive session focuses on overcoming self-doubt, imposter syndrome, and fear of technology while building the mindset needed to thrive in digital careers."
            takeaways={[
              "Mindset techniques to build confidence in digital spaces",
              "How to overcome limiting beliefs and embrace learning",
              "Real-life stories of women who transitioned into tech",
            ]}
            time="10:00 AM (WAT)"
            duration="February 20, 2026"
            link="https://www.eventbrite.com/e/building-digital-confidence-beyond-skills-to-mindset-tickets-1980619613581?aff=oddtdtcreator"
            tags={["#DigitalConfidence", "#MindsetMatters", "#WomenInTech", "#DIIEvents"]}
          />

          <EventCard
            day="Fri"
            month="Mar"
            date="20"
            title="Tech for Good: How Corporates Can Drive Inclusion"
            speakers="Seun Oyedeji"
            image="/images/hero/tech for good.jpeg"
            description="This session explores how businesses can leverage technology to drive inclusion, empower underserved communities, and create shared value through purpose-driven partnerships."
            takeaways={[
              "Case studies on tech-driven corporate impact",
              "How to build effective CSR partnerships for digital inclusion",
              "Insights from leaders driving inclusive growth in Africa",
            ]}
            time="10:00 AM (WAT)"
            duration="March 20, 2026"
            link="#"
            tags={["#TechForGood", "#DigitalInclusion", "#CorporateImpact", "#DIIEvents"]}
          />

          <EventCard
            day="Fri"
            month="Apr"
            date="17"
            title="Digital Skills to Digital Income: Freelancing Pathways"
            speakers="Blossom Ubochi"
            image="/images/hero/freelancing.JPEG"
            description="Freelancing is reshaping how people earn, and Africa is joining the movement. This hands-on webinar introduces participants to freelancing platforms, essential digital tools, and success stories from women who have built sustainable careers online."
            takeaways={[
              "How to identify marketable digital skills",
              "The best freelancing platforms for beginners",
              "Strategies to stand out and build a personal brand online",
            ]}
            time="1:45 PM (WAT)"
            duration="April 17, 2026"
            link="https://www.eventbrite.com/e/digital-skills-to-digital-income-freelancing-pathways-tickets-1980853272461?aff=oddtdtcreator"
            tags={["#Freelancing", "#DigitalIncome", "#WomenInTech", "#DIIEvents"]}
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
  image,
}: any) {
  return (
    <article className="grid gap-12 lg:grid-cols-[120px_360px_1fr] border-t border-black/10 pt-16">
      
      {/* Date */}
      <div className="text-center">
        <span className="block text-xs uppercase tracking-[0.3em] text-black/50">
          {day}
        </span>
        <span className="block text-sm text-black/60 mt-2">{month}</span>
        <span className="block text-4xl font-semibold mt-2">{date}</span>
      </div>

      {/* Flyer */}
      {image && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative group"
        >
          <div className=" overflow-hidden rounded-2xl bg-black/5 shadow-md">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent rounded-2xl pointer-events-none" />
          </div>
        </motion.div>
      )}

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
          Apply Now
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
