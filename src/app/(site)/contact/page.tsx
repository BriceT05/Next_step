import type { Metadata } from "next";
import { ContactView } from "../../components/views-about";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte Next Step.sn : formulaire, téléphone, e-mail et WhatsApp.",
};

export default function ContactPage() {
  return <ContactView />;
}
