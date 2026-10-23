import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import ScrollProgress from "../components/ScrollProgress";
import { SiteDataProvider } from "../components/SiteDataContext";
import { WhatsAppFab } from "../components/ui";
import { getProjects, getSettings } from "@/lib/content";
import { toClientSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return (
    <SiteDataProvider projects={projects} settings={toClientSettings(settings)}>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-white focus:text-ns focus:px-4 focus:py-2 focus:rounded-full focus:font-bold"
      >
        Aller au contenu
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <BackToTop />
    </SiteDataProvider>
  );
}
