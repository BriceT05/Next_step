import { createClient } from '@supabase/supabase-js'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Domains from "./components/Domains"
import Projects from "./components/Projects"
import Stats from "./components/Stats"
import News from "./components/News"
import Gallery from "./components/Gallery"
import Join from "./components/Join"
import Partners from "./components/Partners"
import Footer from "./components/Footer"
import ScrollProgress from "./components/ScrollProgress"
import BackToTop from "./components/BackToTop"
import type { GalleryItem, NewsArticle, Project, Partner } from "@/lib/supabase"

async function fetchData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { gallery: [], news: [], projects: [], partners: [] }

  try {
    const db = createClient(url, key)
    const [g, n, p, pa] = await Promise.all([
      db.from('gallery_items').select('*').order('created_at', { ascending: false }),
      db.from('news_articles').select('*').order('created_at', { ascending: false }),
      db.from('projects').select('*').order('created_at', { ascending: false }),
      db.from('partners').select('*').order('created_at', { ascending: false }),
    ])
    return {
      gallery: (g.data ?? []) as GalleryItem[],
      news: (n.data ?? []) as NewsArticle[],
      projects: (p.data ?? []) as Project[],
      partners: (pa.data ?? []) as Partner[],
    }
  } catch {
    return { gallery: [], news: [], projects: [], partners: [] }
  }
}

export default async function Home() {
  const { gallery, news, projects, partners } = await fetchData()

  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Domains />
      <Projects dbProjects={projects.length > 0 ? projects : undefined} />
      <Stats />
      <News dbArticles={news.length > 0 ? news : undefined} />
      <Gallery dbItems={gallery.length > 0 ? gallery : undefined} />
      <Join />
      <Partners dbPartners={partners.length > 0 ? partners : undefined} />
      <Footer />
      <BackToTop />
    </main>
  )
}
