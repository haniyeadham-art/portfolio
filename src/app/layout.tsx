import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

import { LanguageProvider } from "@/context/LanguageContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Persian glyphs live under the "arabic" subset in Google Fonts. display:
// "swap" prevents FOIT while the font is being fetched by the browser.
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adham — Senior UI/UX Designer",
  description:
    "Senior product designer focused on fintech and SaaS — turning complex flows into calm, performant interfaces.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      // The client provider may mutate lang/dir after mount to match a
      // persisted user preference. This suppresses the resulting attribute
      // mismatch on the <html> element only.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
