import type { Metadata } from "next";
import KineticHero from "@/components/home/KineticHero";
import IntroSlate from "@/components/home/IntroSlate";
import HorizontalWork from "@/components/home/HorizontalWork";
import AboutTeaser from "@/components/home/AboutTeaser";
import NowStrip from "@/components/home/NowStrip";
import ContactCta from "@/components/home/ContactCta";

export const metadata: Metadata = {
  title: "Palash Nagar, UX Designer & HCI Researcher",
  description:
    "UX designer and HCI researcher at RIT, turning thermal illusions into wearables. Design that feels inevitable.",
};

export default function HomePage() {
  return (
    <>
      <KineticHero />
      <IntroSlate />
      <HorizontalWork />
      <AboutTeaser />
      <NowStrip />
      <ContactCta />
    </>
  );
}
