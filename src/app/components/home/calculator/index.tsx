"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is StockVAR a POS system?",
    answer:
      "No. StockVAR does not process sales or payments. It focuses strictly on stock recording, usage tracking, and variance (VAR) reporting.",
  },
  {
    question: "Do my staff need special training to use it?",
    answer:
      "No. The system is designed to be simple and familiar. Most teams understand the flow within a day of use.",
  },
  {
    question: "Can StockVAR work for cafés, lounges, or hotels?",
    answer:
      "Yes. StockVAR works across restaurants, cafés, lounges, hotel kitchens, cloud kitchens, and experience centres.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "No. StockVAR is a paid product. You can either get started immediately or book a guided demo before subscribing.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Subscriptions are billed monthly and can be cancelled at any time.",
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
            Short answers to help you decide quickly.
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
