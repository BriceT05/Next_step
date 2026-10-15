import type { Metadata } from "next";
import { getTeam } from "@/lib/content";
import { TeamView } from "../../../components/views-about";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Notre équipe",
  description: "Le président, la vice-présidente, le bureau exécutif et les équipes des cinq domaines de Next Step.sn.",
};

export default async function TeamPage() {
  const team = await getTeam();
  return <TeamView team={team} />;
}
