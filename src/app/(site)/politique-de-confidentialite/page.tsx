import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import RichText from "../../components/RichText";
import { PageHero } from "../../components/ui";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Next Step.sn",
};

export default async function PolitiqueConfidentialite() {
  const { privacy } = (await getSettings()).legal;
  return (
    <>
      <PageHero title="Politique de confidentialité" text={privacy.updated ? `Dernière mise à jour : ${privacy.updated}` : undefined}
        crumbs={[{ label: "Politique de confidentialité" }]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <RichText text={privacy.body} className="text-ink leading-relaxed" />
      </div>
    </>
  );
}
