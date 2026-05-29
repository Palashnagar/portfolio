import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Palash Nagar",
  description: "Get in touch for full-time roles, freelance projects, or just to say hi.",
};

export default function ContactPage() {
  return <ContactForm />;
}
