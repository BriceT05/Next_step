import type { Metadata } from "next";
import { JoinView } from "../../components/views-about";

export const metadata: Metadata = {
  title: "Nous rejoindre",
  description: "Deviens bénévole, deviens partenaire ou inscris-toi à un projet de Next Step.sn.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ profil?: string; projet?: string }>;
}) {
  const { profil, projet } = await searchParams;
  return <JoinView profil={profil} projet={projet} />;
}
