import { Metadata } from "next";


// Home sections
import Hero from "./components/home/hero";
import About from "./components/home/about";
import DiscoverProperties from "./components/home/property-option"; // mentor section
import Listing from "./components/home/property-list";
import Testimonials from "./components/home/testimonial";


// Global components
import AudioWelcome from "./components/AudioWelcome";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalinclusioninitiative.org"),

  title: {
    default: "Digital Inclusion Initiative",
    template: "%s | Digital Inclusion Initiative",
  },

  description:
    "Digital Inclusion Initiative works to expand digital access, build skills, and create economic opportunities for women and underserved communities through technology.",

  keywords: [
    "digital inclusion",
    "digital access",
    "technology for social impact",
    "women in technology",
    "digital skills training",
    "underserved communities",
    "tech education Africa",
    "digital divide",
    "Digital Inclusion Initiative",
  ],

  openGraph: {
    title: "Digital Inclusion Initiative",
    description:
      "Expanding digital access, building skills, and creating opportunities for women and underserved communities.",
    url: "https://digitalinclusioninitiative.org",
    siteName: "Digital Inclusion Initiative",
    type: "website",
    images: [
      {
        url: "https://digitalinclusioninitiative.org/og/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Inclusion Initiative — Bridging the Digital Divide",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Digital Inclusion Initiative",
    description:
      "Bridging the digital divide through access, skills, and opportunity.",
    images: [
      "https://digitalinclusioninitiative.org/og/og-cover.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://digitalinclusioninitiative.org",
  },
};

export default function Home() {
  return (
    <main>
      {/* Audio welcome — plays once per visit */}
      <AudioWelcome />

      {/* Core sections */}
      <Hero />
      <About />

      {/* Mentor / Opportunity / Engagement section */}
      <DiscoverProperties />

      {/* Impact, listings, or programs */}
      <Listing />

      {/* Social proof */}
      <Testimonials />
    </main>
  );
}
