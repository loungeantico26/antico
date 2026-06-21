'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(t('loginError'))
      setLoading(false)
    } else {
      router.push('/account')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="section-subtitle mb-2">{t('loginBadge')}</p>
          <h1 className="text-3xl font-serif text-cream">{t('loginTitle')}</h1>
          <div className="gold-divider" />
        </div>

        <form onSubmit={handleSubmit} className="card-dark p-8 space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email')}
              required
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              required
              className="input-field pl-11"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn size={16} />
              {loading ? t('loading') : t('loginBtn')}
            </span>
          </button>
        </form>

        <p className="text-center text-cream/40 text-sm mt-6">
          {t('noAccount')}{' '}
          <Link href="/auth/register" className="text-gold hover:underline transition-colors">
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
