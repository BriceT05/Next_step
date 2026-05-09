'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/lib/supabase'
import { addPartner, deletePartner } from '../actions'

const DEFAULT_FORM = { name: '', full_name: '', logo_url: '' }

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPartners = async () => {
    const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false })
    setPartners(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPartners() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'partners')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm(f => ({ ...f, logo_url: data.url ?? '' }))
    setUploading(false)
  }

  const handleAdd = () => {
    if (!form.name) return
    startTransition(async () => {
      await addPartner(form)
      setForm(DEFAULT_FORM)
      setPreviewUrl('')
      if (fileRef.current) fileRef.current.value = ''
      await fetchPartners()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deletePartner(id)
      await fetchPartners()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Partenaires & Sponsors</h1>

      <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 mb-8">
        <h2 className="text-[#D9A657] font-semibold mb-4">Ajouter un partenaire</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Nom court *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Ex: UCAD" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Nom complet</label>
            <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#12A89D]/60"
              placeholder="Ex: Université Cheikh Anta Diop" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-1.5 block">Logo</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
              className="w-full text-gray-400 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9A657]/20 file:text-[#D9A657] file:font-medium cursor-pointer" />
            {uploading && <p className="text-[#12A89D] text-xs mt-1">Upload en cours...</p>}
            {previewUrl && (
              <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-[#74878B]/20 bg-white">
                <Image src={previewUrl} alt="preview" fill className="object-contain p-2" />
              </div>
            )}
          </div>
        </div>
        <button onClick={handleAdd} disabled={isPending || uploading || !form.name}
          className="mt-4 bg-[#D9A657] text-[#182426] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#c49040] transition-all disabled:opacity-50">
          {isPending ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : partners.length === 0 ? (
        <p className="text-gray-500">Aucun partenaire pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map(partner => (
            <div key={partner.id} className="bg-white/3 border border-[#74878B]/20 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-3 overflow-hidden">
                {partner.logo_url ? (
                  <Image src={partner.logo_url} alt={partner.name} width={56} height={56} className="object-contain" />
                ) : (
                  <span className="text-[#D9A657] font-bold text-2xl">{partner.name.charAt(0)}</span>
                )}
              </div>
              <div className="text-white font-bold text-sm">{partner.name}</div>
              <div className="text-[#74878B] text-xs mt-0.5 mb-3 leading-tight">{partner.full_name}</div>
              <button onClick={() => handleDelete(partner.id)}
                className="text-red-400 text-xs hover:text-red-300 transition-colors border border-red-400/30 px-3 py-1 rounded-lg hover:border-red-400/60 w-full">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
