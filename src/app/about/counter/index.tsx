"use client";

import Image from "next/image";

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
    image: "/images/hero/cafe.png",
  },
  {
    title: "Lounges",
    description:
      "Food and drink lounges where stock movement happens across long operating hours and multiple shifts.",
    image: "/images/audience/lounge.jpg",
  },
  {
    title: "Cloud Kitchens",
    description:
      "Delivery-focused kitchens that need clear records of stock usage without a physical storefront.",
    image: "/images/audience/cloud-kitchen.jpg",
  },
  {
    title: "Owner-managed food businesses",
    description:
      "Small to mid-sized food businesses where the owner wants visibility without being present every day.",
    image: "/images/audience/owner-managed.jpg",
  },
];

export default function WhoItsFor() {
  return (
    <section className="relative overflow-hidden bg-[#F9FAFB] py-28">
      {/* Square-line orbit background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,118,110,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,118,110,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative container mx-auto px-6 lg:max-w-screen-xl">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-[#6B7280]">
            Who it is for
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight">
            Built for food businesses
            <br />
            <span className="text-[#6B7280]">
              that care about control.
            </span>
          </h2>
        </div>

        {/* Scroll container */}
        <div className="relative">
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
            {audiences.map((item, index) => (
              <div
                key={index}
                className="min-w-[85%] sm:min-w-[60%] md:min-w-[33%] lg:min-w-[32%]"
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

          {/* Scroll hint */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#F9FAFB] to-transparent" />
        </div>
      </div>
    </section>
  );
}
