"use client";

import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 md:pt-40 pb-28 overflow-hidden bg-[#080b16]">

      {/* Animated Particle Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle-animation opacity-[0.25]" />
      </div>

      {/* Floating Blobs */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[150px] animate-float-slow" />
      <div className="absolute bottom-[-180px] -right-20 h-[360px] w-[360px] rounded-full bg-sky-400/25 blur-[140px] animate-float-slower" />

      <div className="relative z-10 container mx-auto px-5 lg:max-w-screen-xl">

        <div className="grid lg:grid-cols-12 items-start lg:items-center gap-12">

          {/* LEFT TEXT BLOCK */}
          <div className="col-span-6 space-y-6" data-aos="fade-right">

            <h1 className="text-white font-black leading-tight text-3xl md:text-5xl">
              Instant Insurance on WhatsApp,
              <br />
              <span className="text-primary">Powered by AI.</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-md leading-relaxed">
              Get quotes, buy policies, file claims, and chat with your personal AI insurance assistant — 
              all inside WhatsApp.
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="https://api.whatsapp.com/send?phone=2348107942363"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/80 transition"
              >
                Start on WhatsApp
                <ArrowRight size={18} />
              </a>

              <a href="#how" className="flex items-center gap-2 px-7 py-4 border border-white/30 text-white rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 transition">
                Learn More
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* RIGHT VISUAL BLOCK */}
          <div className="col-span-6 relative flex justify-center lg:justify-end" data-aos="fade-left">

            <Image
              src={getImgPath("/images/hero/heromoby.png")}
              alt="WhatsApp Chat UI Illustration"
              width={700}
              height={0}
              className="w-[88%] md:w-[70%] lg:w-[75%] object-contain animate-float"
            />

            <Image
              src={getImgPath("/images/hero/heromobz.png")}
              alt="AI Assistant Character"
              width={350}
              height={0}
              className="absolute bottom-[-25px] right-[-25px] w-[48%] md:w-[40%] lg:w-[38%] object-contain animate-float-delayed"
            />
          </div>

        </div>
      </div>

      <style jsx global>{`
        .particle-animation {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(#ffffff10 1px, transparent 1px);
          background-size: 3px 3px;
          animation: moveParticles 35s linear infinite;
        }
        @keyframes moveParticles {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-20%, -20%); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; }
        .animate-float-slower { animation: float 14s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 1.5s; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

    </section>
  );
}
