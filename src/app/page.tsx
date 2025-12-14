import React from 'react';
import { Metadata } from "next";
import Hero from './components/home/hero';
import Calculator from './components/home/calculator';
import History from './components/home/history';
import Features from './components/shared/features';
import CompanyInfo from './components/home/info';
import BlogSmall from './components/shared/blog';
import DiscoverProperties from './components/home/property-option';
import Listing from './components/home/property-list';
import Testimonials from './components/home/testimonial';
export const metadata = {
  metadataBase: new URL("https://www.chuks.ai"),

  title: {
    default: "Chuks AI – Your Smart WhatsApp Assistant for Property Search, Services & Insurance",
    template: "%s | Chuks AI",
  },

  description:
    "Chuks AI is your intelligent WhatsApp assistant for property search, real-time service automation, insurance plans, payments, and secure digital support. Fast, accurate, and trusted by users for seamless everyday tasks.",

  keywords: [
    "Chuks AI",
    "AI WhatsApp assistant",
    "WhatsApp automation Nigeria",
    "AI property search",
    "insurance services WhatsApp",
    "automated customer support",
    "AI chatbot",
    "real estate AI assistant",
    "AI for payments",
    "smart digital assistant",
  ],

  openGraph: {
    title:
      "Chuks AI – Instant Insurance on Whatsapp",
    description:
      "Chuks AI offers instant insurance on WhatsApp—get quotes, buy policies, file claims, and access support in seconds. Fast, simple, and available 24/7.",
    url: "https://www.chuks.ai",
    siteName: "Chuks AI",
    type: "website",
    images: [
      {
        url: "https://chuksai.netlify.app/_next/image?url=%2Fimages%2Fhero%2Fheromoby.png&w=1920&q=75",
        width: 1200,
        height: 630,
        alt: "Chuks AI – WhatsApp Smart Assistant",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Chuks AI – Your Smart WhatsApp Assistant",
    description:
      "Get instant help with property search, services, insurance, payments, and more using Chuks AI on WhatsApp.",
    images: [
      "https://chuksai.netlify.app/_next/image?url=%2Fimages%2Fhero%2Fheromoby.png&w=1920&q=75",
    ],
    creator: "@chuksai",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://www.chuks.ai",
  },
};


export default function Home() {
  return (
    <main>
      <Hero />
      <DiscoverProperties />
      <Listing />
      <Calculator />
     
      <History />
      <Testimonials />
      <CompanyInfo />
      
    </main>
  )
}
