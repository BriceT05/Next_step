import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { ContactView } from "../../components/views-about";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte Next Step.sn : formulaire, téléphone, e-mail et WhatsApp.",
};

export default async function ContactPage() {
  return <ContactView settings={await getSettings()} />;
}
