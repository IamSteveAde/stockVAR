"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden py-24 md:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[#022219]" />

      {/* Subtle glow */}
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#0F766E]/25 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-[#022C22]/40 blur-3xl" />

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-[70%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* LEFT — BRAND */}
          <div className="lg:col-span-4 space-y-6">
            <Image
              src="/images/logo/stockvarw.svg"
              alt="StockVAR"
              width={140}
              height={36}
              priority
              className="brightness-200"
            />

            <p className="text-sm leading-relaxed text-white/80 max-w-sm">
              StockVAR helps food businesses understand how stock is used,
              identify unexplained variance, and take control of food cost with
              clarity.
            </p>
          </div>

          {/* CENTER — PRODUCT */}
          <div className="lg:col-span-4 space-y-6">
            <span className="block text-[11px] tracking-[0.3em] uppercase text-white/50">
              Product
            </span>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-white/80 hover:text-white transition"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="text-white/80 hover:text-white transition"
                >
                  What you get
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-white/80 hover:text-white transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-white/80 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT — ACTION */}
          <div className="lg:col-span-4 space-y-6">
            <span className="block text-[11px] tracking-[0.3em] uppercase text-white/50">
              Get started
            </span>

            <p className="text-sm leading-relaxed text-white/80 max-w-sm">
              Start using StockVAR today or request a guided demo to see how it
              fits your daily operations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0B5F58]"
              >
                Get started
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Request demo
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-20 text-center text-xs tracking-wide text-white/50">
          © {new Date().getFullYear()} StockVAR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
