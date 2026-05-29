import type { Metadata } from "next";
import { Instrument_Serif, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/fx/Grain";
import { Cursor } from "@/components/fx/Cursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { DistortionDefs } from "@/components/fx/Distortion";
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
    <html lang="en" className={`${instrument.variable} ${bricolage.variable}`}>
      <body>
        <Grain />
        <Cursor />
        <ThermalMode />
        <DistortionDefs />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
