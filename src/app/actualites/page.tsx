import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { NewsArticle } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Actualités & Blog — Next Step.sn",
  description:
    "Restez informé des dernières actualités, événements, formations et opportunités de Next Step.sn.",
};

const STATIC_ARTICLES = [
  {
    id: "1",
    slug: "forum-national-entrepreneurs-2026",
    category: "Événement",
    category_color: "#D9A657",
    title: "Forum National des Jeunes Entrepreneurs 2026 — Inscriptions ouvertes",
    excerpt:
      "La 5e édition du Forum National des Jeunes Entrepreneurs se tiendra à Dakar en juin 2026. Plus de 2 000 jeunes attendus pour 3 jours d'innovation et de networking.",
    date: "8 mai 2026",
    author: "Équipe Next Step.sn",
    read_time: "3 min",
    image_url: "",
  },
  {
    id: "2",
    slug: "programme-mentorat-2026",
    category: "Formation",
    category_color: "#12A89D",
    title: "Lancement du Programme de Mentorat 2026 — 100 jeunes sélectionnés",
    excerpt:
      "Next Step.sn lance son programme de mentorat annuel avec 100 jeunes sélectionnés sur 1 200 candidatures. 12 semaines de coaching intensif avec des leaders africains.",
    date: "2 mai 2026",
    author: "Direction NS",
    read_time: "4 min",
    image_url: "",
  },
  {
    id: "3",
    slug: "partenariat-ucad-nextstep",
    category: "Partenariat",
    category_color: "#0A7F78",
    title: "Next Step.sn signe un partenariat stratégique avec l'UCAD",
    excerpt:
      "Un accord de partenariat entre Next Step.sn et l'Université Cheikh Anta Diop de Dakar permettra aux étudiants d'accéder à nos programmes de formation.",
    date: "25 avril 2026",
    author: "Service Communication",
    read_time: "2 min",
    image_url: "",
  },
];

const GRADIENTS = [
  "from-[#D9A657]/20 to-[#0A7F78]/10",
  "from-[#12A89D]/20 to-[#005F5A]/10",
  "from-[#0A7F78]/20 to-[#12A89D]/10",
];

const CATEGORIES = ["Tous", "Événement", "Formation", "Partenariat", "Actualité", "Opportunité"];

type ArticleItem = (typeof STATIC_ARTICLES)[0] | (NewsArticle & { slug?: string });

async function fetchArticles(): Promise<ArticleItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return STATIC_ARTICLES;
  try {
    const db = createClient(url, key);
    const { data } = await db
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });
    return data && data.length > 0 ? (data as NewsArticle[]) : STATIC_ARTICLES;
  } catch {
    return STATIC_ARTICLES;
  }
}

export default async function ActualitesPage() {
  const articles = await fetchArticles();

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="bg-[#182426] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30 group-hover:ring-[#D9A657] transition-all flex-shrink-0">
              <Image src="/Logo nextstep.jpeg" alt="Next Step.sn" fill sizes="36px" className="object-cover" />
            </div>
            <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-white/70 text-sm group-hover:text-white transition-colors">Accueil</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-[#D9A657] text-sm font-semibold">Actualités</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#182426] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D9A657] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">
            Restez informé
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5">
            Actualités &{" "}
            <span className="text-[#D9A657]">Blog</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Événements, formations, partenariats et opportunités pour les jeunes leaders africains.
          </p>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => {
            const slug = (a as { slug?: string }).slug ?? a.id;
            return (
              <Link
                key={a.id}
                href={`/actualites/${slug}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#12A89D]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`h-48 relative flex items-center justify-center ${
                    !a.image_url ? `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}` : ""
                  }`}
                >
                  {a.image_url ? (
                    <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/40 to-transparent" />
                  )}
                  <div
                    className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border"
                    style={{
                      color: a.category_color,
                      borderColor: `${a.category_color}40`,
                      background: `${a.category_color}15`,
                    }}
                  >
                    {a.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-[#182426] font-bold text-base leading-snug mb-3 group-hover:text-[#D9A657] transition-colors line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="text-[#5A6A70] text-sm leading-relaxed mb-5 line-clamp-3">{a.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                    <span>{a.date}</span>
                    <span>{a.read_time} de lecture</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20 text-[#74878B]">
            Aucun article pour l&apos;instant. Revenez bientôt !
          </div>
        )}
      </div>

      {/* CTA rejoindre */}
      <div className="bg-[#182426] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ne manquez aucune actualité
          </h2>
          <p className="text-white/50 mb-8">
            Rejoignez Next Step.sn et recevez toutes nos opportunités en avant-première.
          </p>
          <Link
            href="/#join"
            className="inline-flex items-center gap-2 bg-[#D9A657] text-[#182426] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#c49040] transition-all hover:scale-105"
          >
            Rejoindre le mouvement
          </Link>
        </div>
      </div>
    </main>
  );
}
