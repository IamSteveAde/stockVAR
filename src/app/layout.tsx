import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";


import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

import { AppContextProvider } from "../context-api/PropertyContext";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/scroll-to-top";
import Aoscompo from "@/utils/aos";
import ChatWidget from "./components/ChatbotEmbed";
import PartnersMarquee from "./components/PartnersMarquee";

/* -------------------------------------
   FONT
------------------------------------- */
const dmsans = DM_Sans({ subsets: ["latin"] });

/* -------------------------------------
   METADATA — DIGITAL INCLUSION INITIATIVE
------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "Digital Inclusion Initiative",
    template: "%s | Digital Inclusion Initiative",
  },
  description:
    "Digital Inclusion Initiative works to expand digital access, build skills, and create opportunities for women and underserved communities through technology.",
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
      <body className={dmsans.className}>
        <AppContextProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
          >
            <Aoscompo>
              <Header />
              <NextTopLoader />
              {children}
              <PartnersMarquee />
              <Footer />
            </Aoscompo>

            

            {/* Global Chat Widget */}
            <ChatWidget />
          </ThemeProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
