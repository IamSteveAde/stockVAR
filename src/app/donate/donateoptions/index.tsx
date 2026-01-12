"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wifi, BookOpen, GraduationCap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function DonateOptions() {
  return (
    <section id="donate-options" className="relative bg-white overflow-hidden">
      {/* Subtle brand wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(95,59,134,0.06), rgba(97,171,187,0.06), rgba(188,200,215,0.14))",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-0 md:py-0">
        <div className="grid gap-20 lg:grid-cols-12 items-start">
          {/* ================= LEFT — IMPACT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-5"
          >
            <span className="section-eyebrow">
              What Your Donation Supports
            </span>

            <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight mb-10">
              Turning generosity into real digital access
            </h2>

            <div className="space-y-10">
              <ImpactItem
                icon={Wifi}
                amount="₦10,000"
                description="Provides one week of internet data for a learner."
                accent="#61abbb"
              />

              <ImpactItem
                icon={BookOpen}
                amount="₦50,000"
                description="Covers training kits, learning resources, and support materials."
                accent="#5f3b86"
              />

              <ImpactItem
                icon={GraduationCap}
                amount="₦215,000"
                description="Supports one learner through a full job-ready bootcamp."
                accent="#61abbb"
              />
            </div>
          </motion.div>

          {/* ================= RIGHT — DONATE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10 md:p-14">
              <span className="block text-[11px] tracking-[0.45em] uppercase text-black/60 mb-6">
                Give Online
              </span>

              <h3 className="text-2xl font-semibold text-black mb-8">
                Choose an amount to donate
              </h3>

              {/* Suggested amounts */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {[
                  "₦10,000",
                  "₦50,000",
                  "₦150,000",
                  "₦500,000",
                  "£50",
                  "£100",
                  "£250",
                ].map((amount) => (
                  <button
                    key={amount}
                    className="
                      rounded-xl
                      border
                      border-black/10
                      py-4
                      text-sm
                      font-medium
                      text-black
                      transition-all
                      hover:border-[#5f3b86]
                      hover:bg-[#5f3b86]/5
                    "
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Donation frequency */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Toggle label="One-Time" />
                <Toggle label="Monthly" />
              </div>

              {/* CTA */}
              <div className="mt-12">
                <a
                  href="https://paystack.shop/pay/zwmc7bp0ww"
                  className="
                    w-full
                    inline-flex
                    items-center
                    justify-center
                    gap-4
                    px-10
                    py-5
                    rounded-2xl
                    text-xs
                    tracking-[0.35em]
                    uppercase
                    font-medium
                    transition-all
                  "
                  style={{
                    backgroundColor: "#5f3b86",
                    color: "#ffffff",
                  }}
                >
                  Donate via Paystack
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Trust note */}
              <p className="mt-6 text-xs text-black/60 leading-relaxed">
                Payments are securely processed. We are committed to transparent
                reporting and responsible use of funds.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================= IMPACT ITEM ================= */
function ImpactItem({
  icon: Icon,
  amount,
  description,
  accent,
}: {
  icon: any;
  amount: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="flex gap-5">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>

      <div>
        <div className="text-sm font-semibold text-black mb-1">
          {amount}
        </div>
        <p className="text-sm text-black/65 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ================= TOGGLE ================= */
function Toggle({ label }: { label: string }) {
  return (
    <button
      className="
        rounded-full
        border
        border-black/15
        px-6
        py-2
        text-xs
        uppercase
        tracking-widest
        transition-all
        hover:border-[#61abbb]
        hover:bg-[#61abbb]/10
      "
    >
      {label}
    </button>
  );
}
