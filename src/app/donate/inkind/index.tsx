"use client";

import { motion } from "framer-motion";
import {
  Laptop,
  Wifi,
  Truck,
  MailCheck,
  ShieldCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function DonateInKind() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Soft brand wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(95,59,134,0.05), rgba(97,171,187,0.05), rgba(188,200,215,0.16))",
        }}
      />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl mb-20"
        >
          <span className="section-eyebrow">
            Donate Devices & Data (In-Kind)
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight">
            Extend the life of technology. Expand digital access.
          </h2>

          <p className="mt-6 text-lg text-black/70 leading-relaxed max-w-2xl">
            In-kind donations help us equip learners and classrooms with reliable
            devices and connectivity. We work with certified partners to ensure
            secure handling, refurbishment, and responsible deployment.
          </p>
        </motion.div>

        {/* ================= GRID ================= */}
        <div className="grid gap-12 lg:grid-cols-2">
          <InKindCard
            icon={Laptop}
            title="Devices We Accept"
            accent="#5f3b86"
          >
            <p>
              Laptops <span className="font-medium">(Intel i5 / 8GB RAM+)</span>,
              tablets, and smartphones{" "}
              <span className="font-medium">(Android 10+ / iOS 14+)</span>.
            </p>
            <p className="mt-3">
              Please remove all passwords and back up personal data before
              donation.
            </p>
          </InKindCard>

          <InKindCard
            icon={Wifi}
            title="Connectivity Support"
            accent="#61abbb"
          >
            <p>
              Sponsor SIM cards, data bundles, or donate mobile hotspots to
              support classrooms and bootcamps.
            </p>
          </InKindCard>

          <InKindCard
            icon={Truck}
            title="Pick-Up / Drop-Off"
            accent="#5f3b86"
          >
            <p>
              We partner with certified ITAD vendors for secure data wiping,
              refurbishment, and logistics.
            </p>
          </InKindCard>

          <InKindCard
            icon={ShieldCheck}
            title="Acknowledgement & Compliance"
            accent="#61abbb"
          >
            <p>
              We issue donation acknowledgement letters. Asset certificates are
              available for corporate donors upon request.
            </p>
          </InKindCard>
        </div>

        {/* ================= CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="mt-24 max-w-3xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#bcc8d7]/40">
              <MailCheck size={18} className="text-black" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-black mb-2">
                Contact Our Devices Team
              </h4>
              <p className="text-sm text-black/70 leading-relaxed">
                To donate devices or connectivity, please email{" "}
                <a
                  href="mailto:info@digitalinclusioninitiative.org"
                  className="underline underline-offset-4 hover:text-black"
                >
                  info@digitalinclusioninitiative.org
                </a>
                . Our team will guide you through next steps.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= CARD ================= */
function InKindCard({
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
      className="rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)] p-10"
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>

      <h3 className="text-xl font-semibold text-black mb-4">
        {title}
      </h3>

      <div className="text-sm text-black/70 leading-relaxed space-y-2">
        {children}
      </div>

      <div
        className="mt-8 h-[2px] w-16"
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}
