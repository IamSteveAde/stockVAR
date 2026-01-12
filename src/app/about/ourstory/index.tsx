"use client";

import { motion } from "framer-motion";
import {
  Laptop,
  Wifi,
  Briefcase,
  Users,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurStory() {
  return (
    <section className="relative overflow-hidden"  style={{
    background: `
      radial-gradient(circle at top right, rgba(97,171,187,0.22) 0%, transparent 42%),
      radial-gradient(circle at bottom left, rgba(188,200,215,0.18) 0%, transparent 45%),
      linear-gradient(135deg, #241033 0%, #4f2f78 55%, #6b46a1 100%)
    `,
  }}>
      <div className="container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">

        {/* ================= OUR STORY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="max-w-4xl"
        >
          <span className="sectionw-eyebrow">
            Our Story
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-white max-w-3xl">
            Closing the gap between talent and opportunity
          </h2>

          <p className="mt-8 text-white/70 leading-relaxed max-w-3xl text-lg">
            The Digital Inclusion Initiative was founded to close the gap between
            talent and opportunity. We partner with communities, companies, and
            government to deliver device access, connectivity, and practical
            bootcamps in{" "}
            <span className="text-white font-medium">
              AI & productivity, Virtual Assistance, and Digital Marketing.
            </span>
          </p>

          <p className="mt-6 text-white/70 leading-relaxed max-w-3xl text-lg">
            Our programmes combine skills training, mentoring, and employability
            pathways — so learners can move confidently into work, freelancing,
            or entrepreneurship.
          </p>
        </motion.div>

        {/* ================= WHAT WE DO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 1, ease }}
          className="mt-28"
        >
          <span className="sectionw-eyebrow">
            What We Do
          </span>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={Laptop}
              title="Job-ready bootcamps"
              text="Run practical digital skills bootcamps and clinics designed for real-world work."
            />
            <Feature
              icon={Wifi}
              title="Devices & connectivity"
              text="Provide devices and data access to eligible learners who need them most."
            />
            <Feature
              icon={Users}
              title="Mentorship & pathways"
              text="Connect graduates to mentors, gigs, and employment opportunities."
            />
            <Feature
              icon={Briefcase}
              title="Partner impact"
              text="Support partners to deliver measurable ESG and SDG outcomes."
            />
          </div>
        </motion.div>

        {/* ================= MISSION & VISION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 1, ease }}
          className="mt-36 grid gap-20 lg:grid-cols-2"
        >
          {/* Mission */}
          <div>
            <span className="sectionw-eyebrow">
              Our Mission
            </span>

            <p className="text-xl leading-relaxed text-white/80 max-w-xl">
              To empower women and underserved learners in Africa with the
              devices, connectivity, and practical digital skills needed to
              access work, build businesses, and thrive in an inclusive digital
              economy.
            </p>

            <div className="mt-10 h-[2px] w-32 bg-gradient-to-r from-[#5f3b86] to-transparent" />
          </div>

          {/* Vision */}
          <div>
            <span className="sectionw-eyebrow">
              Our Vision
            </span>

            <p className="text-xl leading-relaxed text-white/80 max-w-xl">
              A digitally inclusive Africa where no one is left behind — every
              learner connected, skilled, and confident to participate and lead
              in the future of work.
            </p>

            <div className="mt-10 h-[2px] w-32 bg-gradient-to-r from-[#61abbb] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= FEATURE CARD ================= */
function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#bcc8d7]/30 text-white group-hover:bg-[#5f3b86]/10 transition">
        <Icon size={20} />
      </div>

      <h3 className="text-base font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-white/65 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
