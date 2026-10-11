import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import ScrollProgress from "../components/ScrollProgress";
import { WhatsAppFab } from "../components/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
