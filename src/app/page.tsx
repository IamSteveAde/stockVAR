import { Metadata } from "next";

// Home sections
import Hero from "./components/home/hero";
import About from "./components/home/about";
import DiscoverProperties from "./components/home/property-option";
import Listing from "./components/home/property-list";
import Testimonials from "./components/home/testimonial";
import Info from "./components/home/info";
import Calculator from "./components/home/calculator";
import History from "./components/home/history";

export const metadata: Metadata = {
  metadataBase: new URL("https://stockvar.com"),

  title: {
    default: "StockVAR — Restaurant Stock Variance & Inventory Control Software",
    template: "%s | StockVAR",
  },

  description:
    "StockVAR is a stock variance and inventory control software for restaurants, cafés, lounges, hotel kitchens, and food businesses. Track stock usage, detect variance, and reduce losses with clarity.",

  keywords: [
    "restaurant inventory software",
    "stock variance software",
    "restaurant stock control",
    "food business inventory management",
    "restaurant loss prevention software",
    "kitchen stock tracking",
    "restaurant operations software Nigeria",
    "inventory variance tracking",
    "restaurant stock management system",
    "food cost control software",
    "StockVAR",
  ],

  openGraph: {
    title: "StockVAR — Control Restaurant Stock & Detect Variance",
    description:
      "StockVAR helps food businesses track stock usage, detect unexplained variance, and reduce losses across restaurants, cafés, lounges, and hotel kitchens.",
    url: "https://stockvar.com",
    siteName: "StockVAR",
    type: "website",
    images: [
      {
        url: "https://stockvar.netlify.app/_next/image?url=%2Fimages%2Fhero%2Fstock.png&w=3840&q=75",
        width: 1200,
        height: 630,
        alt: "StockVAR — Restaurant Stock Variance & Inventory Control",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StockVAR — Restaurant Stock Variance Software",
    description:
      "Track stock usage, detect variance, and reduce losses across your food business.",
    images: ["https://stockvar.netlify.app/_next/image?url=%2Fimages%2Fhero%2Fstock.png&w=3840&q=75"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://stockvar.com",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <DiscoverProperties />
      <Listing />
      <Info />
      <Testimonials />
      <Calculator />
      <History />
    </main>
  );
}
