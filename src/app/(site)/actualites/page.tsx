import Link from "next/link";
import type { Metadata } from "next";
import { getNews } from "@/lib/content";
import { FinalCta, PageHero, SmartImage } from "../../components/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Actualités et événements",
  description: "Les dernières nouvelles de Next Step.sn : événements, projets, appels à candidatures.",
};

export default async function ActualitesPage() {
  const articles = await getNews();

  return (
    <>
      <PageHero
        kicker="Reste informé"
        title="Actualités et événements"
        text="Nos événements, nos projets et nos appels à candidatures."
        crumbs={[{ label: "Actualités" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {articles.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-pearl bg-white/60 p-10 text-center">
            <p className="font-display font-bold text-xl text-ns">Les premières actualités arrivent bientôt.</p>
            <p className="text-muted mt-2">En attendant, découvre nos projets.</p>
            <Link href="/domaines" className="mt-5 inline-block bg-ns text-white px-6 py-3 rounded-full font-bold hover:bg-ns-dark">
              Voir nos domaines
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <article
                key={a.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-pearl hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-video bg-ns">
                  {a.image_url && (
                    <SmartImage
                      src={a.image_url}
                      alt=""
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-3 left-3 bg-gold text-ink text-xs font-bold px-3 py-1 rounded-full">{a.category}</span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted">
                    {a.date}
                    {a.read_time ? ` · ${a.read_time} de lecture` : ""}
                  </p>
                  <h2 className="font-display font-bold text-lg text-ink leading-snug mt-1">
                    <Link href={`/actualites/${a.id}`} className="after:absolute after:inset-0">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="text-muted text-[15px] leading-relaxed mt-2 line-clamp-3">{a.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <FinalCta />
    </>
  );
}
