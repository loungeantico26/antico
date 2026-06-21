'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, Phone } from 'lucide-react'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    })

    if (signUpError) {
      setError(t('registerError'))
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ name: form.name, phone: form.phone })
        .eq('id', data.user.id)
    }

    router.push('/account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="section-subtitle mb-2">{t('registerBadge')}</p>
          <h1 className="text-3xl font-serif text-cream">{t('registerTitle')}</h1>
          <div className="gold-divider" />
        </div>

        <form onSubmit={handleSubmit} className="card-dark p-8 space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder={t('name')}
              required
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder={t('phone')}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder={t('email')}
              required
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder={t('password')}
              required
              minLength={6}
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
            {loading ? t('loading') : t('registerBtn')}
          </button>
        </form>

        <p className="text-center text-cream/40 text-sm mt-6">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/auth/login" className="text-gold hover:underline transition-colors">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
