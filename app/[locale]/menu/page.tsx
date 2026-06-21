import { setRequestLocale } from 'next-intl/server'
import MenuContent from '@/components/MenuContent'

export default function MenuPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <MenuContent />
}
