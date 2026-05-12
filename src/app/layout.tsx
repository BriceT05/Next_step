import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Step.sn — Jeunesse, Innovation & Leadership au Sénégal",
  description:
    "Next Step.sn est une organisation de jeunesse engagée dans l'accompagnement, la formation et la valorisation des jeunes leaders, entrepreneurs et innovateurs africains.",
  keywords: [
    "jeunesse", "entrepreneuriat", "leadership", "innovation",
    "Sénégal", "Afrique", "formation", "Next Step",
  ],
  openGraph: {
    title: "Next Step.sn — Jeunesse, Innovation & Leadership au Sénégal",
    description:
      "Next Step.sn accompagne les jeunes entrepreneurs, leaders et innovateurs du Sénégal et d'Afrique vers la prochaine étape de leur réussite.",
    url: "https://nextstep.sn",
    siteName: "Next Step.sn",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Next Step.sn — Jeunesse & Leadership au Sénégal",
      },
    ],
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Step.sn — Jeunesse, Innovation & Leadership au Sénégal",
    description:
      "Next Step.sn accompagne les jeunes entrepreneurs, leaders et innovateurs du Sénégal et d'Afrique vers la prochaine étape de leur réussite.",
    images: ["/logo.jpg"],
  },
  metadataBase: new URL("https://nextstep.sn"),
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
