"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Top Hairline Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-[70%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* LEFT — IDENTITY */}
          <div className="lg:col-span-4 space-y-6">
            <span
              className="block text-sm tracking-[0.35em] uppercase text-white font-light"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.35)" }}
            >
              Digital Inclusion Initiative
            </span>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Digital Inclusion Initiative works to expand digital access, build
              practical skills, and create meaningful opportunities for women
              and underserved communities through technology.
            </p>
          </div>

          {/* CENTER — NAVIGATION */}
          <div className="lg:col-span-4 space-y-6">
            <span className="block text-[11px] tracking-[0.3em] uppercase text-white/40">
              Get Involved
            </span>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-white/70 hover:text-white transition"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-white/70 hover:text-white transition"
                >
                  Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/70 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/coursera"
                  className="text-white/70 hover:text-white transition"
                >
                  Coursera Onboarding
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-white/70 hover:text-white transition"
                >
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT — CONTACT & TRUST */}
          <div className="lg:col-span-4 space-y-6">
            <span className="block text-[11px] tracking-[0.3em] uppercase text-white/40">
              Connect
            </span>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              We collaborate with individuals, organisations, and institutions
              committed to closing the digital divide and enabling inclusive
              participation in the digital economy.
            </p>

            <Link
              href="/donate"
              className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/80 border-b border-white/30 pb-1 hover:text-white hover:border-white transition"
            >
             Donate
            </Link>
          </div>
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-20 text-center text-white/40 text-xs tracking-wide">
          © {new Date().getFullYear()} Digital Inclusion Initiative. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
