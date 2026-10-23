'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import { DOMAINS } from '@/app/data/domains'
import { type EventSettings, type GeneralSettings, type SiteSettings, type Stat, SOCIAL_NETWORKS, fetchSettings } from '@/lib/settings'
import { saveEvent, saveGeneralSettings, saveStats } from '@/app/admin/actions'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import { Card, Field, ListEditor, Loading, PageHeader, btnPrimary, inputCls } from '@/app/admin/ui'

type Notice = { ok: boolean; text: string } | null

const CUSTOM = '__autre'

export default function SettingsAdmin() {
  const [loaded, setLoaded] = useState<SiteSettings | null>(null)
  const [general, setGeneral] = useState<GeneralSettings | null>(null)
  const [stats, setStats] = useState<Stat[] | null>(null)
  const [generalNotice, setGeneralNotice] = useState<Notice>(null)
  const [statsNotice, setStatsNotice] = useState<Notice>(null)
  const [event, setEvent] = useState<EventSettings | null>(null)
  const [eventNotice, setEventNotice] = useState<Notice>(null)
  const { projects } = useAdminProjects()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchSettings(supabase).then(setLoaded)
  }, [])

  if (!loaded) return <Loading />

  const g = general ?? loaded
  const s = stats ?? loaded.stats
  const setG = (patch: Partial<GeneralSettings>) => { setGeneralNotice(null); setGeneral({ ...g, ...patch }) }
  const setS = (next: Stat[]) => { setStatsNotice(null); setStats(next) }

  const ev = event ?? loaded.event
  const setE = (patch: Partial<EventSettings>) => { setEventNotice(null); setEvent({ ...ev, ...patch }) }
  const presetLinks = ['/nous-rejoindre?profil=inscription', ...(projects ?? []).map(p => `/projets/${p.slug}`)]
  const linkChoice = presetLinks.includes(ev.href) ? ev.href : CUSTOM

  const linkOf = (name: string) => g.socials.find(x => x.name === name)?.href ?? ''
  const setLink = (name: (typeof SOCIAL_NETWORKS)[number], href: string) =>
    setG({ socials: SOCIAL_NETWORKS.map(n => ({ name: n, href: n === name ? href : linkOf(n) })) })

  const save = (task: () => Promise<{ error?: string }>, notify: (n: Notice) => void) =>
    startTransition(async () => {
      const res = await task()
      notify(res.error ? { ok: false, text: res.error } : { ok: true, text: 'Enregistré. Le site est déjà à jour.' })
    })

  return (
    <div>
      <PageHeader title="Infos & chiffres"
        intro="Les coordonnées et les réseaux sociaux s'affichent dans le pied de page, la page Contact, la page Nous rejoindre et le menu. Les chiffres clés et le prochain événement s'affichent sur la page d'accueil." />

      <div className="space-y-8">
        <form onSubmit={e => { e.preventDefault(); save(() => saveGeneralSettings(g), setGeneralNotice) }}>
          <Card title="Coordonnées">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="E-mail de contact *">
                <input type="email" required value={g.email} onChange={e => setG({ email: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Ville">
                <input value={g.city} onChange={e => setG({ city: e.target.value })} className={inputCls} placeholder="Ex. : Dakar, Sénégal" />
              </Field>
              <Field label="Slogan" hint="Affiché en écriture manuscrite dans le pied de page.">
                <input value={g.slogan} onChange={e => setG({ slogan: e.target.value })} className={inputCls} />
              </Field>
              <div className="sm:col-span-2">
                <p className="text-ink text-sm font-medium mb-1.5">Téléphones *</p>
                <p className="text-muted text-xs mb-3">Avec l&apos;indicatif (+221). Le premier numéro reçoit les messages WhatsApp du site.</p>
                <ListEditor items={g.phones} onChange={phones => setG({ phones })} newItem={{ display: '', wa: '' }} addLabel="Ajouter un numéro"
                  render={(p, update) => (
                    <input value={p.display} onChange={e => update({ display: e.target.value })} className={inputCls}
                      placeholder="+221 77 000 00 00" inputMode="tel" aria-label="Numéro de téléphone" />
                  )} />
              </div>
            </div>
          </Card>

          <Card title="Réseaux sociaux" className="mt-6">
            <p className="text-muted text-sm -mt-2 mb-4">Colle l&apos;adresse complète de la page. Laisse vide pour masquer un réseau.</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {SOCIAL_NETWORKS.map(name => (
                <Field key={name} label={name}>
                  <input type="url" value={linkOf(name)} onChange={e => setLink(name, e.target.value)} className={inputCls}
                    placeholder={`https://www.${name.toLowerCase()}.com/…`} />
                </Field>
              ))}
            </div>
          </Card>

          <SaveBar pending={isPending} notice={generalNotice} label="Enregistrer les coordonnées" />
        </form>

        <form onSubmit={e => { e.preventDefault(); save(() => saveStats(s), setStatsNotice) }}>
          <Card title="Chiffres clés de l'accueil">
            <p className="text-muted text-sm -mt-2 mb-4">Un nombre, un signe facultatif (ex. « + ») et un libellé court. Six chiffres remplissent une ligne sur ordinateur.</p>
            <ListEditor items={s} onChange={setS} newItem={{ value: 0, suffix: '', label: '' }} addLabel="Ajouter un chiffre"
              render={(st, update) => (
                <div className="grid grid-cols-[6.5rem_4.5rem_1fr] gap-3">
                  <input type="number" min={0} value={st.value} onChange={e => update({ value: Number(e.target.value) })}
                    className={inputCls} aria-label="Nombre" />
                  <input value={st.suffix} onChange={e => update({ suffix: e.target.value })} maxLength={4}
                    className={inputCls} placeholder="+" aria-label="Signe après le nombre" />
                  <input value={st.label} onChange={e => update({ label: e.target.value })}
                    className={inputCls} placeholder="Ex. : Élèves réunis" aria-label="Libellé" />
                </div>
              )} />

            {s.length > 0 && (
              <div className="mt-6">
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Aperçu</p>
                <dl className="rounded-2xl bg-ns px-4 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6">
                  {s.map((st, i) => (
                    <div key={i} className="text-center flex flex-col-reverse">
                      <dt className="text-white/90 text-xs mt-1 leading-snug">{st.label || '…'}</dt>
                      <dd className="font-display font-extrabold text-3xl text-gold tabular-nums">
                        {Number(st.value || 0).toLocaleString('fr-FR')}{st.suffix}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </Card>

          <SaveBar pending={isPending} notice={statsNotice} label="Enregistrer les chiffres" />
        </form>

        <form onSubmit={e => { e.preventDefault(); save(() => saveEvent(ev), setEventNotice) }}>
          <Card title="Prochain événement (accueil)">
            <label className="flex items-center gap-2 text-sm text-ink font-medium mb-5 -mt-1">
              <input type="checkbox" checked={ev.enabled} onChange={e => setE({ enabled: e.target.checked })} className="w-4 h-4 accent-ns" />
              Afficher le bloc sur la page d&apos;accueil
            </label>
            <div className={`grid sm:grid-cols-2 gap-5 ${ev.enabled ? '' : 'opacity-50'}`}>
              <Field label="Titre *">
                <input value={ev.title} onChange={e => setE({ title: e.target.value })} className={inputCls} placeholder="Ex. : Forum d'Entrepreneuriat" />
              </Field>
              <Field label="Sous-titre">
                <input value={ev.subtitle} onChange={e => setE({ subtitle: e.target.value })} className={inputCls} placeholder="Ex. : 1re édition" />
              </Field>
              <Field label="Date et heure du compte à rebours *" hint="Heure de Dakar. Le bloc disparaît tout seul une fois la date passée.">
                <input type="datetime-local" value={ev.date.slice(0, 16)}
                  onChange={e => setE({ date: e.target.value ? `${e.target.value}:00Z` : '' })} className={inputCls} />
              </Field>
              <Field label="Date affichée" hint="En toutes lettres, avec le lieu.">
                <input value={ev.dateLabel} onChange={e => setE({ dateLabel: e.target.value })} className={inputCls} placeholder="Ex. : Avril 2027 · Dakar" />
              </Field>
              <Field label="Couleur du domaine">
                <select value={ev.domainSlug} onChange={e => setE({ domainSlug: e.target.value })} className={inputCls}>
                  {DOMAINS.map(d => <option key={d.slug} value={d.slug}>{d.name} · {d.theme}</option>)}
                </select>
              </Field>
              <Field label="Texte du bouton">
                <input value={ev.buttonLabel} onChange={e => setE({ buttonLabel: e.target.value })} className={inputCls} placeholder="Je m'inscris" />
              </Field>
              <Field label="Le bouton mène vers" full>
                <select value={linkChoice} onChange={e => setE({ href: e.target.value === CUSTOM ? '' : e.target.value })} className={inputCls}>
                  {(projects ?? []).map(p => <option key={p.slug} value={`/projets/${p.slug}`}>Projet : {p.title}</option>)}
                  <option value="/nous-rejoindre?profil=inscription">Formulaire d&apos;inscription</option>
                  <option value={CUSTOM}>Autre lien…</option>
                </select>
                {linkChoice === CUSTOM && (
                  <input value={ev.href} onChange={e => setE({ href: e.target.value })} className={`${inputCls} mt-2`}
                    placeholder="https://… ou /actualites/…" aria-label="Autre lien" />
                )}
              </Field>
            </div>
          </Card>

          <SaveBar pending={isPending} notice={eventNotice} label="Enregistrer l'événement" />
        </form>
      </div>
    </div>
  )
}

function SaveBar({ pending, notice, label }: { pending: boolean; notice: Notice; label: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className={btnPrimary}>{pending ? 'Enregistrement…' : label}</button>
      {notice && (
        <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>
      )}
    </div>
  )
}
