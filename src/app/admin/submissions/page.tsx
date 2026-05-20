'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import type { Submission } from '@/lib/supabase'
import { deleteSubmission } from '../actions'

const ROLE_COLORS: Record<string, string> = {
  membre: '#D9A657',
  benevole: '#12A89D',
  partenaire: '#0A7F78',
  participant: '#74878B',
}

const ROLE_LABELS: Record<string, string> = {
  membre: 'Membre',
  benevole: 'Bénévole',
  partenaire: 'Partenaire',
  participant: 'Participant',
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setSubmissions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [])

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteSubmission(id)
      await fetchSubmissions()
    })
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidatures reçues</h1>
          <p className="text-[#74878B] text-sm mt-1">
            {submissions.length} candidature{submissions.length !== 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-[#74878B] bg-white/3 border border-[#74878B]/20 rounded-2xl">
          <div className="text-5xl mb-4">📋</div>
          <p>Aucune candidature pour l&apos;instant.</p>
          <p className="text-sm mt-2 opacity-60">Les candidatures du formulaire &quot;Rejoindre&quot; apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white/3 border border-[#74878B]/20 rounded-xl p-5 hover:border-[#74878B]/35 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ color: ROLE_COLORS[s.role] ?? '#74878B', background: `${ROLE_COLORS[s.role] ?? '#74878B'}18` }}
                    >
                      {ROLE_LABELS[s.role] ?? s.role}
                    </span>
                    <span className="text-[#74878B] text-xs">
                      {new Date(s.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-white font-semibold text-sm">{s.name}</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1.5">
                    <a
                      href={`mailto:${s.email}`}
                      className="text-[#12A89D] text-xs hover:underline flex items-center gap-1"
                    >
                      📧 {s.email}
                    </a>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone}`}
                        className="text-[#74878B] text-xs hover:text-white transition-colors flex items-center gap-1"
                      >
                        📞 {s.phone}
                      </a>
                    )}
                  </div>

                  {s.message && (
                    <p className="text-[#74878B] text-xs mt-2 leading-relaxed bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                      &ldquo;{s.message}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a
                    href={`https://wa.me/${s.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${s.name}, nous avons bien reçu votre candidature Next Step.sn pour le rôle ${ROLE_LABELS[s.role] ?? s.role}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] text-xs border border-[#25D366]/30 rounded-lg px-3 py-1.5 hover:bg-[#25D366]/10 transition-colors flex items-center gap-1"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={isPending}
                    className="text-red-400 text-xs border border-red-400/30 rounded-lg px-3 py-1.5 hover:border-red-400/60 transition-colors disabled:opacity-50"
                  >
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
