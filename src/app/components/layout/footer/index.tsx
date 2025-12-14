"use client";

import Link from "next/link";
import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";
import { MessageCircle, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0d0f16] text-white pt-20 pb-10 overflow-hidden">

      {/* Subtle ring pattern (very soft for dark mode) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <svg viewBox="0 0 800 800" className="w-[1000px] h-[1000px]">
          <circle cx="400" cy="400" r="150" stroke="#ffffff" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="260" stroke="#ffffff" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="360" stroke="#ffffff" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto max-w-screen-xl px-6">

        {/* Top Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-14">

          {/* Logo + blurb */}
          <div className="max-w-sm">
            <Image
              src={getImgPath("/images/logo/chukswhite.png")}
              alt="Chuks AI Logo"
              width={170}
              height={50}
              className="mb-5"
            />

            <p className="text-gray-400 leading-relaxed">
              Your AI-powered WhatsApp insurance assistant—smart, fast, and always available to help you compare, buy, and claim.
            </p>
          </div>

          {/* Footer navigation groups */}
          <div className="flex flex-col sm:flex-row gap-14">

            {/* Company Section */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#how" className="text-gray-400 hover:text-primary transition">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="text-gray-400 hover:text-primary transition">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact / Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Connect</h4>

              <ul className="space-y-3">
                <li>
                  <a href="https://api.whatsapp.com/send?phone=2348107942363" className="flex items-center gap-2 text-gray-400 hover:text-primary transition">
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>

              
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-10"></div>

        {/* Bottom Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Chuks AI. All rights reserved.</p>

          
        </div>

      </div>
    </footer>
  );
}
