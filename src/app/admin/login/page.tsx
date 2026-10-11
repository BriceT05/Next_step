'use client'
import { useState } from 'react'
import Image from 'next/image'
import { login } from '../actions'

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
    <div className="min-h-screen bg-[#182426] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#D9A657]/40">
              <Image src="/logo-emblem.png" alt="Next Step.sn" fill sizes="56px" className="object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Admin</h1>
          <p className="text-[#74878B] text-sm mt-1">Next Step.sn</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#12A89D]/60 transition-colors"
              placeholder="admin@nextstep.sn" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Mot de passe</label>
            <input name="password" type="password" required autoComplete="current-password"
              className="w-full bg-white/5 border border-[#74878B]/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#12A89D]/60 transition-colors"
              placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#D9A657] text-[#182426] py-3 rounded-xl font-bold text-sm hover:bg-[#c49040] transition-all disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-[#74878B] text-sm hover:text-[#D9A657] transition-colors">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  )
}
