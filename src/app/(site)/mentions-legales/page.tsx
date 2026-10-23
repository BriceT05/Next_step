import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import RichText from "../../components/RichText";
import { PageHero } from "../../components/ui";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Next Step.sn",
};

export default async function MentionsLegales() {
  const { mentions } = (await getSettings()).legal;
  return (
    <>
      <PageHero title="Mentions légales" text={mentions.updated ? `Dernière mise à jour : ${mentions.updated}` : undefined}
        crumbs={[{ label: "Mentions légales" }]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <RichText text={mentions.body} className="text-ink leading-relaxed" />
      </div>
    </>
  );
}
