import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { MissionView } from "../../../components/views-about";

export const metadata: Metadata = {
  title: "Mission et valeurs",
  description: "La mission, la vision et les valeurs de Next Step.sn, et sa présence dans les 14 régions du Sénégal.",
};

export default async function MissionPage() {
  return <MissionView settings={await getSettings()} />;
}
