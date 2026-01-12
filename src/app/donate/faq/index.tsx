"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ShieldCheck,
  Target,
  Globe,
  HelpCircle,
  Mail,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function TransparencyAndFAQs() {
  return (
    <section className="relative overflow-hidden bg-[#1e122a] text-white">
      {/* ================= ORBITAL LINE SYSTEM ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[900px] w-[900px] rounded-full border border-white/10"
        />

        {/* Medium orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[620px] w-[620px] rounded-full border border-[#61abbb]/20"
        />

        {/* Inner orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-[380px] w-[380px] rounded-full border border-[#5f3b86]/30"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-6 lg:max-w-screen-xl py-2 md:py-2">
        {/* ================= TRANSPARENCY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="max-w-4xl mb-28"
        >
          <span className="sectionw-eyebrow">
            Transparency & Impact
          </span>

          <h2 className="text-3xl md:text-4xl text-white font-semibold leading-tight mb-12">
            Accountability built into how we operate
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            <Point
              icon={BarChart3}
              title="Quarterly Impact Updates"
              text="We publish regular updates on learners trained, devices distributed, and placement or income outcomes."
            />

            <Point
              icon={Target}
              title="SDG & ESG Alignment"
              text="Our work aligns with SDGs 4, 5, 8, and 9. ESG reporting is available on request."
            />

            <Point
              icon={ShieldCheck}
              title="Restricted & Earmarked Gifts"
              text="Donations may be restricted to bootcamps, devices, or connectivity. Donor intent is always honoured."
            />

            <Point
              icon={Globe}
              title="International Donors & Gift Aid"
              text="For UK donors, Gift Aid may be available via our UK partner. Contact us to learn more."
            />
          </div>
        </motion.div>

        {/* ================= FAQs ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="max-w-4xl"
        >
          <span className="sectionw-eyebrow">
            FAQs
          </span>

          <div className="space-y-10">
            <FAQ
              question="Will I receive a receipt?"
              answer="Yes. Official receipts are issued for all gifts. We can also provide tailored acknowledgement letters."
            />

            <FAQ
              question="Is my card data secure?"
              answer="Yes. Payments are processed via PCI-DSS compliant providers such as Paystack and Stripe. We never store card details."
            />

            <FAQ
              question="Can I restrict my donation?"
              answer="Yes. You may choose to support Devices, Data, or Training Scholarships."
            />

            <FAQ
              question="Questions about my donation?"
              answer="Please email info@digitalinclusioninitiative.org for donation queries or receipts."
            />
          </div>

          {/* ================= PRIVACY ================= */}
          <div className="mt-20 pt-10 border-t border-white/20 max-w-3xl">
            <div className="flex items-start gap-4">
              <Mail size={18} className="text-white/80 mt-1" />
              <p className="text-sm text-white/75 leading-relaxed">
                We respect your privacy. Donor information is used only for
                receipting, stewardship, and legal compliance.{" "}
               
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= POINT ================= */
function Point({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <Icon size={20} className="text-white" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-white/75 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ================= FAQ ================= */
function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
        <HelpCircle size={18} className="text-white" />
      </div>

      <div>
        <h4 className="text-base text-white font-semibold mb-2">{question}</h4>
        <p className="text-sm text-white/75 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
