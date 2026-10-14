'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '../actions'
import { btnPrimary, inputCls } from '../ui'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ns compass-watermark on-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-gold/70 bg-white mb-4">
            <Image src="/logo-emblem.png" alt="Next Step.sn" fill sizes="64px" className="object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Espace administration</h1>
          <p className="font-hand text-gold text-2xl mt-1">Ose rêver</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <label className="block">
            <span className="block text-ink text-sm font-medium mb-1.5">E-mail</span>
            <input name="email" type="email" required autoComplete="email" className={inputCls} placeholder="admin@nextstep.sn" />
          </label>
          <label className="block">
            <span className="block text-ink text-sm font-medium mb-1.5">Mot de passe</span>
            <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          {error && <p className="text-red-700 text-sm bg-red-50 rounded-lg px-3 py-2" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/" className="text-white/70 text-sm hover:text-white transition-colors">← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}
