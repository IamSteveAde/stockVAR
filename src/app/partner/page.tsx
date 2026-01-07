"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Laptop,
  GraduationCap,
  Target,
  Building2,
  ArrowRight,
  Mail,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function PartnerPage() {
  return (
    <main>
      <PartnerHero />
      <WhyPartner />
      <PartnershipBenefits />
      <CallToAction />
    </main>
  );
}

/* ======================================================
   HERO
====================================================== */
function PartnerHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Orbital brand lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[800px] w-[800px] rounded-full border border-[#bcc8d7]/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[520px] w-[520px] rounded-full border border-[#5f3b86]/30"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-16">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="block text-[11px] tracking-[0.55em] uppercase text-black/50 mb-10"
          >
            Partner With Us
          </motion.span>

          <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,3.8rem)] text-black max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease }}
              className="block"
            >
              Join us in building
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#5f3b86] via-[#61abbb] to-[#5f3b86]"
            >
              a digitally inclusive Africa
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="mt-12 max-w-3xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-black/70"
          >
            At the Digital Inclusion Initiative (DII), we believe everyone
            deserves access to technology, data, and job-ready digital skills.
            We partner with organisations that share our vision of an inclusive,
            connected Africa — where no one is left behind.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   WHY PARTNER
====================================================== */
function WhyPartner() {
  return (
    <section className="relative bg-white py-28 md:py-36">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="max-w-3xl mb-20">
          <span className="block text-[11px] tracking-[0.5em] uppercase text-black/60 mb-6">
            Why Partner With DII
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold text-black">
            We can’t close the digital divide alone
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <Benefit
            icon={Laptop}
            title="Provide Devices & Data"
            text="Equip underserved communities with reliable devices and affordable connectivity."
          />
          <Benefit
            icon={GraduationCap}
            title="Fund Digital Skills Training"
            text="Support practical bootcamps in AI, Virtual Assistance, and Digital Marketing."
          />
          <Benefit
            icon={Target}
            title="Advance ESG & SDGs"
            text="Deliver measurable outcomes aligned with SDGs 4, 5, 8, and 9."
          />
          <Benefit
            icon={Building2}
            title="Build Lasting Impact"
            text="Create tangible progress in education, employment, and innovation across Nigeria."
          />
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   PARTNERSHIP BENEFITS
====================================================== */
function PartnershipBenefits() {
  return (
    <section className="relative bg-[#f7f8fb] py-28 md:py-36">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid gap-20 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <h3 className="text-2xl md:text-3xl font-semibold text-black mb-8">
              Partnerships designed for real outcomes
            </h3>

            <p className="text-black/70 leading-relaxed max-w-2xl">
              Whether you are a corporation, donor, foundation, or government
              agency, we co-design partnerships that align impact with strategy.
              From co-branded pilots to in-kind donations and ESG measurement,
              our approach is collaborative and results-driven.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10">
              <h4 className="text-lg font-semibold text-black mb-6">
                Partnership options include:
              </h4>

              <ul className="space-y-4 text-sm text-black/70">
                <li>• Co-branded pilots and programmes</li>
                <li>• In-kind donations (devices and connectivity)</li>
                <li>• Workforce-ready talent pipelines</li>
                <li>• ESG and SDG impact measurement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   CTA
====================================================== */
function CallToAction() {
  return (
    <section className="relative bg-[#1e122a] py-28 md:py-36 text-white">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="max-w-3xl">
          <h3 className="text-3xl md:text-4xl font-semibold mb-8">
            Let’s make inclusion possible
          </h3>

          <p className="text-white/75 leading-relaxed max-w-2xl mb-12">
            Interested in co-branded pilots, in-kind donations, or ESG-aligned
            partnerships? We’ll work with you to design a collaboration that
            delivers meaningful, measurable change.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#5f3b86] text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/90 transition"
            >
              Become a Partner
              <ArrowRight size={16} />
            </Link>

            <a
              href="mailto:info@digitalinclusioninitiative.org"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-white/30 text-xs tracking-[0.35em] uppercase hover:bg-white/10 transition"
            >
              Email Our Team
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   BENEFIT CARD
====================================================== */
function Benefit({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)] p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#61abbb]/20 mb-6">
        <Icon size={20} className="text-[#61abbb]" />
      </div>

      <h4 className="text-lg font-semibold text-black mb-3">
        {title}
      </h4>

      <p className="text-sm text-black/65 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
