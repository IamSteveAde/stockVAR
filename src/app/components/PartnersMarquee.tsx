"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  "/images/hero/ups.svg",
  "/images/hero/diatom.svg",
  "/images/hero/eterra.svg",
];

export default function PartnersMarquee() {
  return (
    <section className="relative py-28 overflow-hidden">

      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="absolute inset-0">
        {/* Brand gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5f3b86]/10 via-white to-[#61abbb]/10" />

        {/* Soft radial glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#5f3b86]/10 blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl mb-20">
        <div className="max-w-xl">
          <span className="section-eyebrow mb-6">
  Our Partners
</span>


          <p className="text-lg text-black/70 leading-relaxed">
            We collaborate with forward-thinking organisations committed to
            digital access, skills, and inclusive opportunity.
          </p>
        </div>
      </div>

      {/* ================= EDGE FADES ================= */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white to-transparent z-20" />

      {/* ================= MARQUEE ================= */}
      <div className="relative z-10 overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-28"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...partners, ...partners].map((logo, i) => (
            <Logo key={i} src={logo} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ================= LOGO CARD ================= */

function Logo({ src }: { src: string }) {
  return (
    <div
      className="
        group
        relative
        h-28
        w-72
        flex
        items-center
        justify-center
        rounded-3xl
        bg-white/70
        backdrop-blur-xl
        border
        border-black/5
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.12)]
      "
    >
      <Image
        src={src}
        alt="Partner logo"
        fill
        className="
          object-contain
          grayscale
          opacity-80
          transition-all
          duration-500
          group-hover:grayscale-0
          group-hover:opacity-100
          scale-[0.9]
          group-hover:scale-[0.95]
        "
      />
    </div>
  );
}
