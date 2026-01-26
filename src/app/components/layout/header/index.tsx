"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Detect dark sections */
  useEffect(() => {
    const sections =
      document.querySelectorAll<HTMLElement>("section[data-dark]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setOnDark(entries.some((entry) => entry.isIntersecting));
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Lock scroll on mobile menu */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          backdrop-blur-xl
          transition-colors duration-300
          ${onDark ? "bg-transparent text-white" : "bg-white/80 text-[#111827]"}
        `}
      >
        <div className="container mx-auto px-6 lg:max-w-screen-xl">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link href="/" className="z-50 flex items-center">
              <Image
                src="/images/logo/stockvars.svg"
                alt="StockVAR"
                width={120}
                height={32}
                className={`transition ${
                  onDark ? "invert brightness-200" : ""
                }`}
                priority
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10">
              <NavItem onDark={onDark} href="#how-it-works">How it works</NavItem>
              <NavItem onDark={onDark} href="#benefits">What you get</NavItem>
              <NavItem onDark={onDark} href="#pricing">Pricing</NavItem>
              <NavItem onDark={onDark} href="#faq">FAQ</NavItem>
            </nav>

            {/* DESKTOP CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/demo"
                className={`
                  rounded-lg px-5 py-2.5 text-sm font-medium
                  transition
                  ${onDark
                    ? "border border-white/30 text-white hover:bg-white/10"
                    : "border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]"
                  }
                `}
              >
                Request demo
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B5F58]"
              >
                Get started
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden z-50 h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/20 border border-white/30"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#111827]/95 backdrop-blur-2xl">
          <nav className="h-full flex flex-col items-center justify-center gap-6">
            <MobileNavItem href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </MobileNavItem>

            <MobileNavItem href="#benefits" onClick={() => setMenuOpen(false)}>
              What you get
            </MobileNavItem>

            <MobileNavItem href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </MobileNavItem>

            <MobileNavItem href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </MobileNavItem>

            <div className="mt-8 flex flex-col gap-4 w-64">
              <Link
                href="/start"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-lg bg-[#0F766E] py-3 text-center text-sm font-medium text-white"
              >
                Get started
              </Link>

              <Link
                href="/demo"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-lg border border-white/30 py-3 text-center text-sm font-medium text-white"
              >
                Request demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({
  href,
  children,
  onDark,
}: {
  href: string;
  children: React.ReactNode;
  onDark: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        text-[11px] tracking-[0.3em] uppercase
        transition-colors
        ${onDark ? "text-white/90 hover:text-white" : "text-[#111827]/80 hover:text-[#111827]"}
      `}
    >
      {children}
    </Link>
  );
}

/* ================= MOBILE ITEM ================= */
function MobileNavItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-white/90 text-sm tracking-[0.35em] uppercase transition hover:opacity-70"
    >
      {children}
    </Link>
  );
}
