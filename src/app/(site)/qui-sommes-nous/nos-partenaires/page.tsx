import type { Metadata } from "next";
import { getDbPartners } from "@/lib/content";
import { PartnersView } from "../../../components/views-about";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nos partenaires",
  description: "Les institutions, partenaires techniques et financiers et partenaires de terrain de Next Step.sn.",
};

export default async function PartnersPage() {
  return <PartnersView dbPartners={await getDbPartners()} />;
}
