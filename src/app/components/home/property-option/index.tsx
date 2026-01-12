"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { getImgPath } from "@/utils/pathUtils";

/* -------------------------------------
   IMAGE SLIDES (RIGHT SIDE)
------------------------------------- */
const mentorImages = [
  "/images/hero/1.jpg",
  "/images/hero/2.jpg",
  "/images/hero/3.jpg",
  "/images/hero/4.jpg",
  "/images/hero/5.jpg",
  "/images/hero/6.jpg",
  "/images/hero/7.jpg",
  "/images/hero/8.jpg",
  "/images/hero/9.jpg",
];

/* -------------------------------------
   FADE VARIANT
------------------------------------- */
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function MentorSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % mentorImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Deep Purple Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, #7b4db3 0%, transparent 45%), linear-gradient(135deg, #3a1d5d 0%, #5f3b86 50%, #2a123f 100%)",
        }}
      />

      {/* Floating Orbits */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 h-[420px] w-[420px] rounded-full border border-white/10 animate-orbit-slow" />
        <div className="absolute top-1/2 left-1/3 h-[620px] w-[620px] rounded-full border border-white/5 animate-orbit-reverse" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-6">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="grid gap-20 lg:grid-cols-12 items-center">
            {/* LEFT — TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-3 text-white/80 mb-6">
                <Sparkles size={18} />
                <span className="sectionw-eyebrow">
                  Mentorship
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-light leading-tight text-white">
                Become a Mentor
              </h2>

              <p className="mt-6 text-white/80 max-w-xl leading-relaxed text-lg">
                Share your expertise to help women and underserved learners gain
                skills, confidence, and real pathways to work across{" "}
                <span className="text-white font-medium">
                  AI, Virtual Assistance, Digital Marketing, and Digital Skills.
                </span>
              </p>

              <div className="mt-10">
                <a
                  href="/mentor"
                  className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-xs tracking-[0.3em] uppercase font-medium transition-all group"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#5f3b86",
                  }}
                >
                  Become a Mentor
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </motion.div>

            {/* RIGHT — IMAGE SLIDER */}
<div className="lg:col-span-7 relative h-[520px] rounded-3xl overflow-hidden shadow-[0_60px_160px_rgba(0,0,0,0.45)]">
  {mentorImages.map((img, i) => (
    <motion.div
      key={img}
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: i === index ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ zIndex: i === index ? 2 : 1 }}
    >
      <Image
        src={getImgPath(img)}
        alt="Mentorship in action"
        fill
        className="object-cover"
        priority={i === 0}
      />
      <div className="absolute inset-0 bg-black/25" />
    </motion.div>
  ))}
</div>

          </div>
        </div>
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-orbit-slow {
          animation: orbit 90s linear infinite;
        }

        .animate-orbit-reverse {
          animation: orbit 140s linear infinite reverse;
        }
      `}</style>
    </section>
  );
}
