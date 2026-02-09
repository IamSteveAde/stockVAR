"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is StockVAR a POS system?",
    answer:
      "No. StockVAR does not handle sales, payments, or receipts. It focuses strictly on raw food stock recording, shift-based usage tracking, and variance (VAR) reporting.",
  },
  {
    question: "Will my staff find it difficult to use?",
    answer:
      "No. StockVAR is designed for kitchen operations. Most staff understand how to record stock and usage within a single shift.",
  },
  {
    question: "What types of businesses is StockVAR for?",
    answer:
      "StockVAR is built for restaurants, cafés, lounges, and hotel kitchens that manage raw food stock across shifts.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You get a 3-day free trial with full access. No credit card is required.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. StockVAR is billed monthly, and you can cancel at any time without penalties.",
  },
  {
  question: "Do you provide onboarding or staff training?",
  answer:
    "Yes. StockVAR is simple to use, but onboarding and staff training are available if needed to help your team get started smoothly.",
},

];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F9FAFB] py-28" id="faq">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#6B7280]">
            FAQ
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-[#111827]">
            Common questions
          </h2>

          <p className="mt-4 text-lg text-[#6B7280]">
            Clear answers before you get started.
          </p>

        </div>

        {/* FAQ list */}
        <div className="max-w-3xl space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E7EB] bg-white"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-[#111827]">
                    {item.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#6B7280] transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-[#374151]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
