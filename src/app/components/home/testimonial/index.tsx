"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative bg-white py-6">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">
        <div className="grid gap-20 lg:grid-cols-12 items-start">
          {/* LEFT — INTRO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 text-black/60 mb-6">
              <Mail size={18} />
              <span className="section-eyebrow">
                Contact
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-light leading-tight text-black">
              Contact Us
            </h2>

            <p className="mt-6 text-black/60 max-w-md leading-relaxed text-lg">
              Drop us a line. Whether you’d like to donate, partner with us, or
              simply make an enquiry, we’d love to hear from you.
            </p>
          </motion.div>

          {/* RIGHT — FORM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <form className="rounded-3xl border border-black/5 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs tracking-wide uppercase text-black/50 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-black/10 px-4 py-4 text-sm outline-none focus:border-[#5f3b86]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs tracking-wide uppercase text-black/50 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-black/10 px-4 py-4 text-sm outline-none focus:border-[#5f3b86]"
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs tracking-wide uppercase text-black/50 mb-2">
                    Purpose of Contact
                  </label>
                  <select
                    className="w-full rounded-xl border border-black/10 px-4 py-4 text-sm bg-white outline-none focus:border-[#5f3b86]"
                  >
                    <option value="">Select an option</option>
                    <option value="donate">Donation Enquiry</option>
                    <option value="partner">Partnership</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="mentor">Mentorship</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs tracking-wide uppercase text-black/50 mb-2">
                    Message*
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="w-full rounded-xl border border-black/10 px-4 py-4 text-sm outline-none focus:border-[#5f3b86] resize-none"
                  />
                </div>

                {/* Newsletter */}
                <label className="flex items-start gap-3 text-sm text-black/60">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#5f3b86]"
                  />
                  <span>
                    Sign up for our email list for updates, promotions, and more.
                  </span>
                </label>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xs tracking-[0.3em] uppercase font-medium transition-all group bg-[#5f3b86] text-white hover:opacity-90"
                  >
                    Send
                    <Send
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
