"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const audiences = [
  {
    title: "Restaurants",
    description:
      "Owner-managed or manager-led restaurants that need better control over daily stock usage and food cost.",
    image: "/images/hero/restaurant.png",
  },
  {
    title: "Cafés",
    description:
      "Cafés tracking milk, coffee beans, sugar, and other stock items used consistently throughout the day.",
    image: "/images/hero/cafes.png",
  },
  {
    title: "Lounges",
    description:
      "Food and drink lounges where stock movement happens across long operating hours and multiple shifts.",
    image: "/images/hero/lounges.png",
  },
  {
    title: "Hotel Kitchens",
    description:
      "Large and mid-sized hotel kitchens managing buffet service, room service, and staff meals across multiple shifts, where stock control and consistency are critical to profitability.",
    image: "/images/hero/hotel.png",
  },
  {
    title: "Retail Experience Spaces",
    description:
      "Brand showrooms and retail environments that serve coffee, drinks, or light refreshments as part of the customer experience, where stock control supports consistency and cost management.",
    image: "/images/hero/retail.png",
  },
];

export default function WhoItsFor() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.offsetWidth * 0.9;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#F9FAFB] py-28">
      {/* Square-line orbit background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,118,110,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,118,110,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Header + arrows */}
        <div className="mb-16 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-widest text-[#6B7280]">
              Who it is for
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight">
              Built for food businesses
              <br />
              <span className="text-[#6B7280]">that care about control.</span>
            </h2>
          </div>

          {/* Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F3F4F6]"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F3F4F6]"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable cards (swipe + arrows, scrollbar hidden) */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {audiences.map((item, index) => (
            <div
              key={index}
              className="min-w-[90%] sm:min-w-[65%] md:min-w-[33%]"
            >
              <div className="group h-full rounded-3xl border border-[#E5E7EB] bg-white shadow-sm transition hover:shadow-md">
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-[#111827]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#374151]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
