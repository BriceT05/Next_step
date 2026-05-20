'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/lib/supabase'
import { addGalleryItem, deleteGalleryItem } from '../actions'

const TAGS = ['Événement', 'Formation', 'Tech', 'Conférence', 'Environnement', 'Atelier', 'Réseau', 'Célébration', 'Équipe', 'Terrain', 'Agriculture']

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ label: '', sub: '', tag: TAGS[0], image_url: '', video_url: '' })
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchItems = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'gallery')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (mediaType === 'video') {
      setForm(f => ({ ...f, video_url: data.url ?? '' }))
    } else {
      setForm(f => ({ ...f, image_url: data.url ?? '' }))
    }
    setUploading(false)
  }

  const handleAdd = () => {
    if (!form.label) return
    startTransition(async () => {
      await addGalleryItem({ label: form.label, sub: form.sub, tag: form.tag, image_url: form.image_url, video_url: form.video_url || undefined })
      setForm({ label: '', sub: '', tag: TAGS[0], image_url: '', video_url: '' })
      setPreviewUrl('')
      setMediaType('image')
      if (fileRef.current) fileRef.current.value = ''
      await fetchItems()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteGalleryItem(id)
      await fetchItems()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Galerie Média</h1>

      <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 mb-8">
        <h2 className="text-[#D9A657] font-semibold mb-4">Ajouter une photo</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Titre *</label>
            <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Ex: Forum Entrepreneurs 2026" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Sous-titre</label>
            <input value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Ex: 300+ participants" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Catégorie</label>
            <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
              className="w-full bg-[#182426] border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60">
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Type de média</label>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => setMediaType('image')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mediaType === 'image' ? 'bg-[#D9A657] text-[#182426]' : 'border border-[#74878B]/30 text-[#74878B]'}`}>
                Photo
              </button>
              <button type="button" onClick={() => setMediaType('video')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mediaType === 'video' ? 'bg-[#12A89D] text-white' : 'border border-[#74878B]/30 text-[#74878B]'}`}>
                Vidéo
              </button>
            </div>
            <input ref={fileRef} type="file" accept={mediaType === 'video' ? 'video/*' : 'image/*'} onChange={handleFileChange}
              className="w-full text-gray-400 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9A657]/20 file:text-[#D9A657] file:font-medium cursor-pointer" />
            {uploading && <p className="text-[#12A89D] text-xs mt-1">Upload en cours...</p>}
          </div>
        </div>
        {previewUrl && (
          <div className="mt-4 relative w-40 h-28 rounded-xl overflow-hidden border border-[#74878B]/20">
            <Image src={previewUrl} alt="preview" fill className="object-cover" />
          </div>
        )}
        <button onClick={handleAdd} disabled={isPending || uploading || !form.label}
          className="mt-4 bg-[#D9A657] text-[#182426] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#c49040] transition-all disabled:opacity-50">
          {isPending ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Aucune photo pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative bg-white/3 border border-[#74878B]/20 rounded-xl overflow-hidden">
              <div className="relative h-36">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.label} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#D9A657]/20 to-[#12A89D]/10 flex items-center justify-center text-3xl">🖼️</div>
                )}
                <div className="absolute inset-0 bg-[#182426]/0 group-hover:bg-[#182426]/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="text-white text-xs font-semibold truncate">{item.label}</div>
                <div className="text-[#74878B] text-xs mt-0.5">{item.tag}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
