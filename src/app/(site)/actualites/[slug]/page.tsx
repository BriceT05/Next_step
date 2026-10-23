import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNews, getProjects } from "@/lib/content";
import { findProject } from "@/lib/projects";
import RichText from "../../../components/RichText";
import { ShareButtons } from "../../../components/MediaGallery";
import { Breadcrumb, SmartImage } from "../../../components/ui";

export const revalidate = 300;

async function getArticle(id: string) {
  const articles = await getNews();
  return { article: articles.find((a) => a.id === id), others: articles.filter((a) => a.id !== id).slice(0, 3) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticle(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image_url || "/og-nextstep.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ article, others }, projects] = await Promise.all([getArticle(slug), getProjects()]);
  if (!article) notFound();
  const project = article.project_slug ? findProject(projects, article.project_slug) : undefined;

  return (
    <>
      <section className="bg-ns text-white compass-watermark on-dark overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-10">
          <Breadcrumb crumbs={[{ label: "Actualités", href: "/actualites" }, { label: article.title }]} />
          <span className="inline-block bg-gold text-ink text-xs font-bold px-3 py-1 rounded-full mb-4">{article.category}</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight">{article.title}</h1>
          <p className="mt-4 text-white/90">
            {article.date}
            {article.author ? ` · ${article.author}` : ""}
            {article.read_time ? ` · ${article.read_time} de lecture` : ""}
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {article.image_url && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-lg">
            <SmartImage src={article.image_url} alt="" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}
        {article.body ? (
          <>
            {article.excerpt && <p className="text-xl text-ink font-semibold leading-relaxed mb-6">{article.excerpt}</p>}
            <RichText text={article.body} className="text-lg text-ink leading-relaxed" />
          </>
        ) : (
          <RichText text={article.excerpt} className="text-lg text-ink leading-relaxed" />
        )}
        {project && (
          <Link
            href={`/projets/${project.slug}`}
            className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-cream border border-pearl p-5 hover:border-ns"
          >
            <span>
              <span className="block text-sm text-muted">Projet lié</span>
              <span className="block font-display font-bold text-ink">{project.title}</span>
            </span>
            <span className="font-bold text-ns">Voir le projet →</span>
          </Link>
        )}
        <div className="mt-10 pt-6 border-t border-pearl">
          <p className="font-semibold text-ink mb-3">Partager cet article</p>
          <ShareButtons title={article.title} />
        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-display font-bold text-2xl text-ns mb-6">À lire aussi</h2>
            <ul className="grid md:grid-cols-3 gap-4">
              {others.map((a) => (
                <li key={a.id}>
                  <Link href={`/actualites/${a.id}`} className="block h-full bg-cream rounded-2xl border border-pearl p-5 hover:border-ns">
                    <p className="text-sm text-muted">{a.date}</p>
                    <p className="font-display font-bold text-ink leading-snug mt-1">{a.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
