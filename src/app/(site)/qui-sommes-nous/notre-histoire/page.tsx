import type { Metadata } from "next";
import { HistoryView } from "../../../components/views-about";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "Tout a commencé par un pas : l'histoire de Next Step.sn, des premiers salons d'orientation de 2025 aux cinq domaines d'aujourd'hui.",
};

export default function HistoryPage() {
  return <HistoryView />;
}
