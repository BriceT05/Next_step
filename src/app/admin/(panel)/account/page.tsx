'use client'
import { useEffect, useState, useTransition } from 'react'
import { changeCredentials, getAccount } from '@/app/admin/actions'
import { Card, Field, Loading, PageHeader, btnPrimary, inputCls } from '@/app/admin/ui'

const MIN_LENGTH = 10

export default function AccountPage() {
  const [account, setAccount] = useState<{ email: string; fromEnv: boolean } | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { getAccount().then(setAccount) }, [])

  if (!account) return <Loading />

  const mail = email ?? account.email
  const mismatch = next.length > 0 && confirm.length > 0 && next !== confirm
  const tooShort = next.length > 0 && next.length < MIN_LENGTH
  const nothingToSave = !next && mail.trim().toLowerCase() === account.email.toLowerCase()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mismatch || tooShort || nothingToSave) return
    setNotice(null)
    startTransition(async () => {
      const res = await changeCredentials({ currentPassword: current, email: mail, newPassword: next })
      if (res.error) { setNotice({ ok: false, text: res.error }); return }
      setNotice({ ok: true, text: 'Enregistré. Les autres appareils connectés ont été déconnectés.' })
      setCurrent(''); setNext(''); setConfirm('')
      setAccount(await getAccount())
      setEmail(null)
    })
  }

  const type = show ? 'text' : 'password'

  return (
    <div>
      <PageHeader title="Mon compte" intro="L'e-mail et le mot de passe qui servent à se connecter à cet espace d'administration." />

      {account.fromEnv && (
        <p className="mb-6 rounded-xl bg-gold/10 border border-gold/30 text-ink text-sm px-4 py-3 max-w-2xl">
          Les identifiants actuels viennent de la configuration du serveur. Dès que tu les changes ici, ce sont ceux enregistrés
          dans la base qui comptent (stockés chiffrés).
        </p>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card title="Identifiants de connexion">
          <div className="grid gap-5">
            <Field label="E-mail de connexion">
              <input type="email" required value={mail} onChange={e => setEmail(e.target.value)} autoComplete="username" className={inputCls} />
            </Field>
            <Field label="Nouveau mot de passe" hint={`Au moins ${MIN_LENGTH} caractères. Laisse vide pour ne changer que l'e-mail. Une phrase de plusieurs mots est facile à retenir et difficile à deviner.`}>
              <input type={type} value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" className={inputCls} />
              {tooShort && <span className="block text-red-700 text-xs mt-1.5">Encore {MIN_LENGTH - next.length} caractère{MIN_LENGTH - next.length > 1 ? 's' : ''}.</span>}
            </Field>
            {next && (
              <Field label="Confirmer le nouveau mot de passe">
                <input type={type} value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" className={inputCls} required />
                {mismatch && <span className="block text-red-700 text-xs mt-1.5">Les deux mots de passe ne sont pas identiques.</span>}
              </Field>
            )}
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} className="w-4 h-4 accent-ns" />
              Afficher les mots de passe
            </label>
            <div className="border-t border-pearl pt-5">
              <Field label="Mot de passe actuel *" hint="Pour confirmer que c'est bien toi.">
                <input type={type} required value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" className={inputCls} />
              </Field>
            </div>
          </div>
        </Card>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isPending || !current || mismatch || tooShort || nothingToSave || (Boolean(next) && !confirm)} className={btnPrimary}>
            {isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {notice && <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>}
        </div>
        <p className="text-muted text-xs mt-4">
          Après un changement, tous les autres appareils connectés à l&apos;admin sont déconnectés ; celui-ci reste connecté.
        </p>
      </form>
    </div>
  )
}
