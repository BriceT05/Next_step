'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { NewsArticle } from '@/lib/supabase'
import { addNewsArticle, deleteNewsArticle } from '../actions'

const CATEGORIES = [
  { label: 'Événement', color: '#D9A657' },
  { label: 'Formation', color: '#12A89D' },
  { label: 'Partenariat', color: '#0A7F78' },
  { label: 'Actualité', color: '#74878B' },
  { label: 'Opportunité', color: '#D9A657' },
]

const DEFAULT_FORM = {
  category: 'Événement', category_color: '#D9A657',
  title: '', excerpt: '', date: '', author: 'Équipe Next Step.sn',
  read_time: '3 min', image_url: '',
}

export default function NewsAdmin() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchArticles = async () => {
    const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false })
    setArticles(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const handleCategoryChange = (cat: string) => {
    const found = CATEGORIES.find(c => c.label === cat)
    setForm(f => ({ ...f, category: cat, category_color: found?.color ?? '#74878B' }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'news')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm(f => ({ ...f, image_url: data.url ?? '' }))
    setUploading(false)
  }

  const handleAdd = () => {
    if (!form.title) return
    startTransition(async () => {
      await addNewsArticle(form)
      setForm(DEFAULT_FORM)
      setPreviewUrl('')
      if (fileRef.current) fileRef.current.value = ''
      await fetchArticles()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNewsArticle(id)
      await fetchArticles()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Actualités & Blog</h1>

      <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 mb-8">
        <h2 className="text-[#D9A657] font-semibold mb-4">Publier un article</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Titre *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Titre de l'article" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Catégorie</label>
            <select value={form.category} onChange={e => handleCategoryChange(e.target.value)}
              className="w-full bg-[#182426] border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60">
              {CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-1.5 block">Résumé</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60 resize-none"
              placeholder="Résumé de l'article..." />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Date</label>
            <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Ex: 9 mai 2026" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Auteur</label>
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Équipe Next Step.sn" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Temps de lecture</label>
            <input value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="3 min" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
              className="w-full text-gray-400 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9A657]/20 file:text-[#D9A657] file:font-medium cursor-pointer" />
            {uploading && <p className="text-[#12A89D] text-xs mt-1">Upload en cours...</p>}
          </div>
        </div>
        {previewUrl && (
          <div className="mt-4 relative w-40 h-28 rounded-xl overflow-hidden border border-[#74878B]/20">
            <Image src={previewUrl} alt="preview" fill className="object-cover" />
          </div>
        )}
        <button onClick={handleAdd} disabled={isPending || uploading || !form.title}
          className="mt-4 bg-[#D9A657] text-[#182426] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#c49040] transition-all disabled:opacity-50">
          {isPending ? 'Publication...' : 'Publier'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">Aucun article pour l&apos;instant.</p>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <div key={article.id} className="flex items-center gap-4 bg-white/3 border border-[#74878B]/20 rounded-xl p-4">
              {article.image_url && (
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold mb-1" style={{ color: article.category_color }}>{article.category}</div>
                <div className="text-white text-sm font-semibold truncate">{article.title}</div>
                <div className="text-[#74878B] text-xs mt-0.5">{article.date} · {article.author}</div>
              </div>
              <button onClick={() => handleDelete(article.id)}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 border border-red-400/30 rounded-lg hover:border-red-400/60 transition-all flex-shrink-0">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
