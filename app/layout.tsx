import type { Metadata } from "next";
import { Instrument_Serif, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/fx/Grain";
import { Cursor } from "@/components/fx/Cursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { ThermalMode } from "@/components/fx/ThermalMode";

const instrument = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Mono accent — used ONLY for small technical labels (filter chips, badges,
// meta, counters, read-times). Headlines/body stay serif + grotesque.
const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Palash Nagar — UX Designer & HCI Researcher",
  description:
    "UX designer and HCI researcher at RIT. Designing interfaces that feel inevitable — from thermal-illusion wearables to software people actually want to use.",
  metadataBase: new URL("https://palashnagar.vercel.app"),
  openGraph: {
    title: "Palash Nagar — UX Designer & HCI Researcher",
    description:
      "Designing interfaces that feel inevitable — from thermal-illusion wearables to software people actually want to use.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${bricolage.variable} ${jetbrains.variable}`}
    >
      <body>
        <Grain />
        <Cursor />
        <ThermalMode />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
