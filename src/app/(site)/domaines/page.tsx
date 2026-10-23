import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { DomainsListView } from "../../components/views-domains";

export const metadata: Metadata = {
  title: "Nos domaines",
  description:
    "Yoonal, Yëgël, La Voix du Leader, Kaddu et SËDAR : cinq domaines, un même rêve, accompagner chaque jeune vers son prochain pas.",
};

export default async function DomainsPage() {
  return <DomainsListView projects={await getProjects()} />;
}
