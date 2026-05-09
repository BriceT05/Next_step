'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'
import { addProject, deleteProject } from '../actions'

const CATEGORIES = ['Événement', 'Formation', 'Environnement', 'Technologie', 'Entrepreneuriat', 'Conférence']
const STATUSES = ['En cours', 'Inscriptions ouvertes', 'Candidatures ouvertes', 'Accompli', 'Permanent', 'À venir']
const DEFAULT_FORM = { title: '', description: '', category: CATEGORIES[0], status: STATUSES[0], image_url: '' }

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'projects')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm(f => ({ ...f, image_url: data.url ?? '' }))
    setUploading(false)
  }

  const handleAdd = () => {
    if (!form.title) return
    startTransition(async () => {
      await addProject(form)
      setForm(DEFAULT_FORM)
      setPreviewUrl('')
      if (fileRef.current) fileRef.current.value = ''
      await fetchProjects()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteProject(id)
      await fetchProjects()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Projets</h1>

      <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 mb-8">
        <h2 className="text-[#D9A657] font-semibold mb-4">Ajouter un projet</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Titre *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Nom du projet" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Catégorie</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#182426] border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60 resize-none"
              placeholder="Décrivez le projet..." />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Statut</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full bg-[#182426] border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
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
          {isPending ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">Aucun projet pour l&apos;instant.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white/3 border border-[#74878B]/20 rounded-xl overflow-hidden">
              <div className="relative h-36">
                {project.image_url ? (
                  <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#D9A657]/20 to-[#12A89D]/10 flex items-center justify-center text-3xl">🚀</div>
                )}
              </div>
              <div className="p-4">
                <div className="text-[#D9A657] text-xs font-bold mb-1">{project.category}</div>
                <div className="text-white text-sm font-semibold mb-1 line-clamp-1">{project.title}</div>
                <div className="text-[#74878B] text-xs mb-3 line-clamp-2">{project.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[#12A89D] text-xs">{project.status}</span>
                  <button onClick={() => handleDelete(project.id)}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors border border-red-400/30 px-2 py-1 rounded-lg hover:border-red-400/60">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
