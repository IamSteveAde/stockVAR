"use client";

import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";

export default function PartnerSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-32 h-2 w-2 rounded-full bg-[#5f3b86]/20 animate-float-slow" />
        <div className="absolute top-1/3 right-40 h-3 w-3 rounded-full bg-[#61abbb]/20 animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 h-2 w-2 rounded-full bg-[#5f3b86]/15 animate-float-fast" />
        <div className="absolute bottom-20 right-1/3 h-4 w-4 rounded-full bg-[#bcc8d7]/30 animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-black/10 animate-float-medium" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-6">
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-black/60 mb-6">
              <Handshake size={18} />
              <span className="section-eyebrow">
                Collaboration
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-black">
              Partner with Digital Inclusion Initiative
            </h2>

            {/* Body */}
            <p className="mt-6 text-black/60 max-w-2xl leading-relaxed text-lg">
              We’re always looking for new partners to collaborate on projects
              and events. If your organisation shares our values and mission,
              let’s work together to create meaningful and lasting impact
              through digital inclusion.
            </p>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="/partner"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-xs tracking-[0.3em] uppercase font-medium transition-all group"
                style={{
                  backgroundColor: "#5f3b86",
                  color: "#ffffff",
                }}
              >
                Partner With Us
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* GLOBAL PARTICLE ANIMATIONS */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        .animate-float-slow {
          animation: float 14s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float 10s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
