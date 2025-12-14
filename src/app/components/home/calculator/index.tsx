"use client";

import {
  HeartPulse,
  CarFront,
  Plane,
  HeartHandshake,
  Smartphone,
  BriefcaseBusiness,
} from "lucide-react";

export default function InsuranceServices() {
  const services = [
    {
      title: "Health Insurance",
      desc: "Affordable, flexible health coverage for individuals and families.",
      icon: HeartPulse,
    },
    {
      title: "Auto Insurance",
      desc: "Protect your vehicle with comprehensive or third-party plans.",
      icon: CarFront,
    },
    {
      title: "Travel Insurance",
      desc: "Get international or local travel protection within minutes.",
      icon: Plane,
    },
    {
      title: "Life Insurance",
      desc: "Secure your loved ones with trusted long-term protection.",
      icon: HeartHandshake,
    },
    {
      title: "Device / Phone Insurance",
      desc: "Instant cover for screen damage, liquid damage, theft & more.",
      icon: Smartphone,
    },
    {
      title: "SME Business Insurance",
      desc: "Strong protection for small and growing businesses.",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section
      className="relative py-24 overflow-hidden bg-[#0b0e1a] dark:bg-[#050816]"
      id="services"
    >
      {/* Soft Glow Blobs */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-150px] -left-10 h-80 w-80 rounded-full bg-sky-400/20 blur-[120px]" />

      <div className="relative z-10 container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-primary/80 mb-3">
            Insurance Services
          </p>

          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            data-aos="fade-left"
          >
            Everything you need to protect what matters most.
          </h2>

          <p className="text-base md:text-lg text-slate-300">
            Choose the coverage you want and let Chuks AI handle everything —
            instantly through WhatsApp.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg
                           shadow-[0_18px_45px_rgba(0,0,0,0.25)]
                           transition duration-300
                           hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] hover:border-primary/40"
                data-aos="fade-up"
                data-aos-delay={100 * (i + 1)}
              >
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-primary/20 bg-primary/10 p-3 
                               group-hover:bg-primary/20 group-hover:border-primary/40 transition">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-1">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  {service.desc}
                </p>

                {/* WhatsApp CTA (Now a Link) */}
                <a
                  href="https://api.whatsapp.com/send?phone=2348107942363"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center px-5 py-2 rounded-xl 
                                   bg-primary text-white text-sm font-medium 
                                   hover:bg-primary/90 transition-all"
                >
                  Start on WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
