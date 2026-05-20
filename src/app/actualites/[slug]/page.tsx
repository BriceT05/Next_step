import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { NewsArticle } from "@/lib/supabase";

const STATIC_ARTICLES = [
  {
    id: "1",
    slug: "forum-national-entrepreneurs-2026",
    category: "Événement",
    category_color: "#D9A657",
    title: "Forum National des Jeunes Entrepreneurs 2026 — Inscriptions ouvertes",
    excerpt:
      "La 5e édition du Forum National des Jeunes Entrepreneurs se tiendra à Dakar en juin 2026. Plus de 2 000 jeunes attendus pour 3 jours d'innovation et de networking.",
    content: `
Le Forum National des Jeunes Entrepreneurs revient pour sa 5e édition en juin 2026 à Dakar. Organisé par Next Step.sn en partenariat avec des institutions publiques et privées, cet événement est devenu le plus grand rassemblement entrepreneurial de la jeunesse sénégalaise.

**Au programme :**
- 3 jours de conférences, pitchs et masterclasses
- Plus de 50 speakers nationaux et internationaux
- Compétition de startups avec prix à la clé
- Sessions de networking et de mentorat
- Espace exposition pour les jeunes entreprises

**Comment s'inscrire ?**
Les inscriptions sont ouvertes jusqu'au 31 mai 2026. Rendez-vous dans la section "Rejoindre" de notre site pour soumettre votre candidature.

Rejoignez des milliers de jeunes entrepreneurs et donnez un élan à votre projet !
    `,
    date: "8 mai 2026",
    author: "Équipe Next Step.sn",
    read_time: "3 min",
    image_url: "",
    created_at: "2026-05-08T00:00:00Z",
  },
  {
    id: "2",
    slug: "programme-mentorat-2026",
    category: "Formation",
    category_color: "#12A89D",
    title: "Lancement du Programme de Mentorat 2026 — 100 jeunes sélectionnés",
    excerpt:
      "Next Step.sn lance son programme de mentorat annuel avec 100 jeunes sélectionnés sur 1 200 candidatures. 12 semaines de coaching intensif avec des leaders africains.",
    content: `
Next Step.sn est fière d'annoncer le lancement de son Programme de Mentorat 2026 avec la sélection de 100 jeunes talents parmi 1 200 candidatures reçues.

**Ce programme c'est :**
- 12 semaines de coaching intensif
- Un mentor dédié, leader africain reconnu
- Des ateliers hebdomadaires en présentiel et en ligne
- Un réseau de 500+ anciens mentorés
- Un certificat reconnu par nos partenaires institutionnels

**Profil des sélectionnés :**
Les 100 participants sont âgés de 18 à 35 ans, issus de 5 régions du Sénégal. Ils portent des projets dans les domaines de l'entrepreneuriat, de la technologie, de l'agriculture et de l'éducation.

Le programme démarre en juin 2026. Félicitations à tous les sélectionnés !
    `,
    date: "2 mai 2026",
    author: "Direction NS",
    read_time: "4 min",
    image_url: "",
    created_at: "2026-05-02T00:00:00Z",
  },
  {
    id: "3",
    slug: "partenariat-ucad-nextstep",
    category: "Partenariat",
    category_color: "#0A7F78",
    title: "Next Step.sn signe un partenariat stratégique avec l'UCAD",
    excerpt:
      "Un accord de partenariat entre Next Step.sn et l'Université Cheikh Anta Diop de Dakar permettra aux étudiants d'accéder à nos programmes de formation.",
    content: `
Next Step.sn et l'Université Cheikh Anta Diop de Dakar (UCAD) ont officialisé leur partenariat stratégique lors d'une cérémonie au Rectorat de l'UCAD.

**Objectifs du partenariat :**
- Permettre aux étudiants de l'UCAD d'accéder gratuitement aux programmes de formation Next Step
- Co-organiser des événements entrepreneuriaux sur le campus
- Créer un club entrepreneuriat UCAD × Next Step
- Offrir des stages et opportunités aux membres des deux structures

**Déclaration du Président de Next Step.sn :**
"Ce partenariat est une étape majeure pour nous. L'UCAD représente des dizaines de milliers d'étudiants talentueux. Ensemble, nous allons créer la prochaine génération de leaders africains."

La collaboration démarre dès la rentrée académique 2026-2027.
    `,
    date: "25 avril 2026",
    author: "Service Communication",
    read_time: "2 min",
    image_url: "",
    created_at: "2026-04-25T00:00:00Z",
  },
];

type StaticArticle = (typeof STATIC_ARTICLES)[0];

async function getArticle(slug: string): Promise<StaticArticle | null> {
  // Try static first
  const staticMatch = STATIC_ARTICLES.find((a) => a.slug === slug || a.id === slug);
  if (staticMatch) return staticMatch;

  // Try Supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const db = createClient(url, key);
    const { data } = await db.from("news_articles").select("*").eq("id", slug).single();
    if (!data) return null;
    return { ...data, slug: data.id, content: data.excerpt } as StaticArticle;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article introuvable — Next Step.sn" };
  return {
    title: `${article.title} — Next Step.sn`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image_url ? [article.image_url] : ["/logo.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const otherArticles = STATIC_ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="bg-[#182426] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30 group-hover:ring-[#D9A657] transition-all flex-shrink-0">
              <Image src="/Logo nextstep.jpeg" alt="Next Step.sn" fill sizes="36px" className="object-cover" />
            </div>
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/actualites" className="text-white/60 text-sm hover:text-white transition-colors">Actualités</Link>
          <span className="text-white/20">/</span>
          <span className="text-[#D9A657] text-sm font-semibold truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Hero article */}
      <div className="bg-[#182426] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border mb-6"
            style={{
              color: article.category_color,
              borderColor: `${article.category_color}40`,
              background: `${article.category_color}15`,
            }}
          >
            {article.category}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/40 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
              {article.date}
            </span>
            <span>{article.read_time} de lecture</span>
          </div>
        </div>
      </div>

      {/* Image bannière */}
      {article.image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image src={article.image_url} alt={article.title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none text-[#374151]">
          <p className="text-xl text-[#5A6A70] leading-relaxed mb-8 font-medium border-l-4 border-[#D9A657] pl-6">
            {article.excerpt}
          </p>
          {article.content.trim().split("\n\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
              return (
                <h3 key={i} className="text-xl font-bold text-[#182426] mt-8 mb-4">
                  {trimmed.slice(2, -2)}
                </h3>
              );
            }
            if (trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="space-y-2 my-4">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[#5A6A70]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9A657] mt-2.5 flex-shrink-0" />
                      {item.slice(2)}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-[#5A6A70] leading-relaxed mb-4">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link href="/actualites" className="inline-flex items-center gap-2 text-[#5A6A70] text-sm hover:text-[#D9A657] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Toutes les actualités
          </Link>
          <span className="text-[#5A6A70] text-sm">{article.date}</span>
        </div>
      </div>

      {/* Autres articles */}
      {otherArticles.length > 0 && (
        <div className="bg-[#F5F7F6] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[#182426] mb-8">Autres actualités</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/actualites/${a.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-[#12A89D]/30 transition-all"
                >
                  <div
                    className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mb-3"
                    style={{ color: a.category_color, borderColor: `${a.category_color}40`, background: `${a.category_color}15` }}
                  >
                    {a.category}
                  </div>
                  <h3 className="text-[#182426] font-bold text-sm leading-snug mb-2 group-hover:text-[#D9A657] transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-[#5A6A70] text-xs">{a.date} · {a.read_time} de lecture</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
