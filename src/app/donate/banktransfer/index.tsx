"use client";

import { motion } from "framer-motion";
import { Mail, Globe, Landmark } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function DonateBankTransfer() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle brand wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(95,59,134,0.05), rgba(97,171,187,0.05), rgba(188,200,215,0.15))",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl mb-20"
        >
          <span className="section-eyebrow">
            Donate by Bank Transfer
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight">
            Make a direct contribution via bank transfer
          </h2>

          <p className="mt-6 text-lg text-black/70 leading-relaxed max-w-2xl">
            You may support the Digital Inclusion Initiative via direct bank
            transfer. Please use the details below and send proof of payment to
            receive an official receipt.
          </p>
        </motion.div>

        {/* Accounts */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* ================= NGN ================= */}
          <AccountCard
            icon={Landmark}
            title="NGN Account (Nigeria)"
            accent="#5f3b86"
          >
            <Detail label="Account Name" value="Digital Inclusion Initiative" />
            <Detail label="Bank" value="Stanbic IBTC (NG)" />
            <Detail label="Account Number" value="0075520677" highlight />
          </AccountCard>

          {/* ================= USD ================= */}
          <AccountCard
            icon={Globe}
            title="USD (International)"
            accent="#61abbb"
          >
            <Detail label="Account Name" value="Digital Inclusion Initiative" />
            <Detail label="Bank" value="Stanbic IBTC" />
            <Detail label="SWIFT Code" value="SBICNGLX" highlight />
            <p className="mt-4 text-xs text-black/60">
              For international wires, your bank may apply transfer or
              intermediary fees.
            </p>
          </AccountCard>
        </div>

        {/* Receipt note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
          className="mt-20 max-w-3xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#bcc8d7]/40">
              <Mail size={18} className="text-black" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-black mb-2">
                Request an Official Receipt
              </h4>
              <p className="text-sm text-black/70 leading-relaxed">
                Please email proof of payment to{" "}
                <a
                  href="mailto:info@digitalinclusioninitiative.org"
                  className="underline underline-offset-4 hover:text-black"
                >
                  info@digitalinclusioninitiative.org
                </a>{" "}
                to receive your official donation receipt.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= ACCOUNT CARD ================= */
function AccountCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: any;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease }}
      className="relative rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10"
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>

      <h3 className="text-xl font-semibold text-black mb-6">
        {title}
      </h3>

      <div className="space-y-4">{children}</div>

      <div
        className="mt-8 h-[2px] w-16"
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}

/* ================= DETAIL ROW ================= */
function Detail({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-6 border-b border-black/10 pb-2">
      <span className="text-sm text-black/60">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-black" : "text-black/80"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
