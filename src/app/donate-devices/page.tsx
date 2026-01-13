"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Laptop,
  Wifi,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function DeviceBankPage() {
  return (
    <main className="bg-white overflow-hidden">

      {/* ================= HERO / BANNER ================= */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">

        {/* Background image */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 40, ease: "linear" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/device-bank/hero.jpg" /* replace */
            alt="DII Device & Data Bank"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5f3b86]/85 via-[#5f3b86]/70 to-[#61abbb]/50" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl text-white">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="sectionw-eyebrow"
          >
            DII Device & Data Bank
          </motion.span>

          <h1 className="font-semibold leading-[1.05] text-[clamp(2.6rem,6vw,4rem)] max-w-4xl">
            Like a community bank <br />
            for digital access
          </h1>

          <p className="mt-10 max-w-2xl text-white/90 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed">
            We provide refurbished devices and connectivity support so people can
            learn, work, and thrive online — with dignity, safety, and opportunity.
          </p>
        </div>
      </section>

      {/* ================= WHAT IS ================= */}
      <section className="py-15 relative">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid lg:grid-cols-2 gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">
              What is the Device & Data Bank?
            </h2>

            <p className="text-black/70 leading-relaxed mb-6">
              DII’s Device & Data Bank bridges digital access gaps by matching
              donated laptops, tablets, smartphones, and data support to learners
              and job-seekers on low incomes.
            </p>

            <p className="text-black/70 leading-relaxed">
              We work through trusted local hubs and verified community partners
              to make access safe, simple, and human-centred.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="rounded-3xl p-12 bg-gradient-to-br from-[#5f3b86]/10 via-[#61abbb]/10 to-[#bcc8d7]/20"
          >
            <h3 className="font-semibold text-black mb-6">Why it matters</h3>
            <p className="text-black/70 leading-relaxed">
              Connectivity is essential for education, healthcare, and employment.
              Yet millions cannot afford devices or data. This programme removes
              those barriers so people can join, learn, and earn.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-15 bg-[#f9fafc] relative">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">

          <h2 className="text-3xl md:text-4xl font-semibold mb-20">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <Step
              icon={Laptop}
              title="Donations"
              text="Devices and data donated by individuals and corporate partners undergo secure wiping and refurbishment via certified ITAD partners."
            />
            <Step
              icon={Users}
              title="Hubs"
              text="Local hubs assess needs, distribute devices and SIMs, and onboard beneficiaries to stay safe and productive online."
            />
            <Step
              icon={Wifi}
              title="Support"
              text="Beneficiaries receive starter data, essential skills, and optional enrollment into DII Academy tracks."
            />
          </div>
        </div>
      </section>

      {/* ================= ELIGIBILITY ================= */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl grid lg:grid-cols-2 gap-20">

          <div>
            <h3 className="text-2xl text-black font-semibold mb-6">Who can receive support?</h3>
            <ul className="space-y-3 text-black/70">
              <li>• 18+ from low-income households</li>
              <li>• Limited access to a working device or data</li>
              <li>• Commitment to learning or job search</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl text-black font-semibold mb-6">Priority groups</h3>
            <ul className="space-y-3 text-black/70">
              <li>• Women and underserved youth (18–35)</li>
              <li>• Public and low-fee schools</li>
              <li>• Community groups supporting at-risk learners</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-15 bg-gradient-to-r from-[#5f3b86] via-[#5f3b86] to-[#61abbb] text-white">
        <div className="container mx-auto px-6 lg:max-w-screen-xl flex flex-col md:flex-row items-center justify-between gap-10">

          <div>
            <h3 className="text-3xl font-semibold mb-4">
              Help someone connect, learn, and earn
            </h3>
            <p className="text-white/90 max-w-xl">
              Whether you need support or want to donate devices, your action
              today opens real opportunities.
            </p>
          </div>

          <div className="flex gap-6">
            <Link
              href="https://forms.gle/PuuqcxguseNYTxr39
here is link to apply for device"
              target="_blank"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#5f3b86] text-xs tracking-[0.35em] uppercase font-medium hover:bg-white/90 transition"
            >
              Apply for a Device
              <ArrowRight size={16} />
            </Link>

            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSc4FOZBQXtz8CVKRJoTbFl7IUEat8WfkHOsGSJ35A7HZsgLTQ/viewform"
              target="_blank"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-white/40 text-xs tracking-[0.35em] uppercase hover:bg-white/10 transition"
            >
              Donate a Device
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SDGs ================= */}
      <section className="py-15">
        <div className="container mx-auto px-6 lg:max-w-screen-xl max-w-4xl">
          <h3 className="text-2xl text-black font-semibold mb-6">
            DII Tech Device Bank & the UN SDGs
          </h3>

          <p className="text-black/70 leading-relaxed">
            The Device Bank advances SDGs 4, 5, 8, 9, 12, 13, and 17 by enabling
            education, gender equity, decent work, innovation, responsible
            consumption, climate action, and partnerships — making technology a
            force for inclusion and sustainability.
          </p>
        </div>
      </section>

     

    </main>
  );
}

/* ================= STEP COMPONENT ================= */
function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="relative">
      <div className="h-12 w-12 rounded-xl bg-[#5f3b86]/10 flex items-center justify-center mb-6">
        <Icon size={20} className="text-[#5f3b86]" />
      </div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <p className="text-black/70 leading-relaxed">{text}</p>
    </div>
  );
}
