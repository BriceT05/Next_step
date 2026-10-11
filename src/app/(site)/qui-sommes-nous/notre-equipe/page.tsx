import type { Metadata } from "next";
import { TeamView } from "../../../components/views-about";

export const metadata: Metadata = {
  title: "Notre équipe",
  description: "Le bureau exécutif et les responsables des cinq domaines de Next Step.sn.",
};

export default function TeamPage() {
  return <TeamView />;
}
