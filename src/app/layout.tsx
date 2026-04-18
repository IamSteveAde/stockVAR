import type { Metadata } from "next";
import "./globals.css";


import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { SubscriptionProvider } from "@/app/context/SubscriptionContext"

import { AppContextProvider } from "../context-api/PropertyContext";


import ScrollToTop from "./components/scroll-to-top";
import Aoscompo from "@/utils/aos";
import { Toaster } from "react-hot-toast";



/* -------------------------------------
   FONT
------------------------------------- */
// Bypassing next/font/google due to Turbopack network request failure
// font-family natively mapped in globals.css

/* -------------------------------------
   METADATA — DIGITAL INCLUSION INITIATIVE
------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "StockVAR",
    template: "%s | StockVAR",
  },
  description:
    "StockVAR is a stock variance and inventory control software for restaurants, cafés, lounges, hotel kitchens, and food businesses. Track stock usage, detect variance, and reduce losses with clarity.",
};

/* -------------------------------------
   ROOT LAYOUT
------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased text-[#111827] bg-[#F9FAFB]">
        <SubscriptionProvider>
           <AppContextProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
          >
            <Aoscompo>
              
              <NextTopLoader />
              <Toaster />
              {children}
              
             
            </Aoscompo>

            

            {/* Global Chat Widget */}
            
          </ThemeProvider>
        </AppContextProvider>
        </SubscriptionProvider>

      </body>
    </html>
  );
}
