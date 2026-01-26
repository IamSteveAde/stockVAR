"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#F9FAFB] overflow-hidden py-32">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid min-h-[90vh] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* LEFT: TEXT */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#111827]">
              Run{" "}
              <span className="text-[#0F766E]">
                VAR
              </span>{" "}
              on your restaurant stock
            </h1>

            <p className="max-w-xl text-lg text-[#374151] leading-relaxed">
              Track how stock items are used, detect unexplained losses, and
              understand where your food cost is going — without guesswork.
            </p>

            <p className="text-sm text-[#6B7280]">
              Built for restaurants and cafés in Nigeria.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-[#0F766E] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#115E59]"
              >
                Get Started
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg border border-[#D1D5DB] px-8 py-4 text-sm font-medium text-[#111827] transition hover:bg-white"
              >
                Request a demo
              </Link>
            </div>
          </div>

          {/* RIGHT: DASHBOARD PREVIEW */}
          <div className="relative">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <Image
                src="/images/hero/stock.webp"
                alt="StockVAR dashboard preview"
                width={1200}
                height={800}
                className="rounded-2xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
