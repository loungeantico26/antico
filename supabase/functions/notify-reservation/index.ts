import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CALLMEBOT_API_KEY = Deno.env.get('CALLMEBOT_API_KEY') ?? ''
const WHATSAPP_PHONE = '995591403832'

serve(async (req) => {
  const payload = await req.json()
  const r = payload.record

  if (!r || !CALLMEBOT_API_KEY) return new Response('skip', { status: 200 })

  const itemsList = (r.pre_order_items || [])
    .map((i: { name: string; quantity: number; price: number }) =>
      `  • ${i.name} × ${i.quantity} — ₾${i.price * i.quantity}`)
    .join('\n')

  const message = [
    `🔔 *ახალი ჯავშანი — Lounge Antico*`,
    ``,
    `👤 ${r.name}`,
    `📞 ${r.phone}`,
    `📅 ${r.date} · ${r.time}`,
    r.order_type === 'dine-in' ? `👥 ${r.guests} პირი` : `📦 წასაღებად`,
    itemsList ? `\n🍽️ შეკვეთა:\n${itemsList}\n💰 სულ: ₾${r.pre_order_total}` : '',
    r.message ? `\n💬 ${r.message}` : '',
  ].filter(Boolean).join('\n')

  const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`
  await fetch(url).catch(() => null)

  return new Response('ok', { status: 200 })
})
