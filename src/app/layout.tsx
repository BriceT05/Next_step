import type { Metadata } from "next";
import { Caveat, Inter, Poppins } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

// Titres : police arrondie et affirmée
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Textes : très lisible à l'écran
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Slogan « Ose rêver » : lettres manuscrites
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const title = "Next Step.sn — Ose rêver";
const description =
  "Next Step.sn est une association sénégalaise de jeunesse, présente dans les 14 régions. Orientation, entrepreneuriat, leadership, engagement communautaire et autonomisation de la femme : trouve ton prochain pas.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | Next Step.sn" },
  description,
  keywords: [
    "Next Step.sn", "jeunesse", "Sénégal", "orientation", "entrepreneuriat", "leadership",
    "engagement communautaire", "autonomisation de la femme", "Yoonal", "Yëgël", "Kaddu", "SËDAR",
  ],
  openGraph: {
    title,
    description,
    url: "https://nextstep.sn",
    siteName: "Next Step.sn",
    images: [{ url: "/og-nextstep.jpg", width: 1200, height: 630, alt: "Next Step.sn — Ose rêver" }],
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-nextstep.jpg"],
  },
  metadataBase: new URL("https://nextstep.sn"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
