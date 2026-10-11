import type { Metadata } from "next";
import { getMedia } from "@/lib/content";
import { GalleryView } from "../../components/views-about";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Galerie",
  description: "Les photos et vidéos des actions de Next Step.sn, par domaine, par projet et par année.",
};

export default async function GalleryPage() {
  return <GalleryView media={await getMedia()} />;
}
