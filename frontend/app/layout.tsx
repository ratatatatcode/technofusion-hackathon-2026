import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";

import { PixelEffects } from "@/components/PixelEffects";
import Providers from "@/lib/provider/Provider";

import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CampusQuest",
  description: "Pixelated campus mission UI built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${vt323.variable}`}>
        <PixelEffects />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
