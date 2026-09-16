import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

// Typography per research.md §7: a high-contrast display serif for tracked
// headline caps, a clean sans for body copy, and the same serif's italic
// style for short accent taglines.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
  style: ["normal"],
});

const accent = Fraunces({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400"],
  style: ["italic"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Orbolo",
  description: "Beef, live cattle, and land stewardship from Paraguay — choose your path into the Orbolo ecosystem.",
};

export const viewport: Viewport = {
  themeColor: "#F4F0E6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${accent.variable} ${body.variable} font-body bg-cream text-forest antialiased`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
