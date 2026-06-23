import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const CALLMEBOT_API_KEY = Deno.env.get('CALLMEBOT_API_KEY') ?? ''
const WHATSAPP_PHONE = '995591403832'
const RESTAURANT_EMAIL = 'lounge.antico26@gmail.com'

async function sendWhatsApp(message: string) {
  if (!CALLMEBOT_API_KEY) return
  const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`
  await fetch(url).catch(() => null)
}

serve(async (req) => {
  const payload = await req.json()
  const r = payload.record

  const orderTypeLabel = r.order_type === 'takeout' ? '📦 წასაღებად' : '🍽️ მაგიდაზე'
  const itemsList = (r.pre_order_items || [])
    .map((i: { name: string; quantity: number; price: number }) => `  • ${i.name} × ${i.quantity} — ₾${i.price * i.quantity}`)
    .join('\n')

  // WhatsApp message
  const waMessage = [
    `🔔 *ახალი ჯავშანი — Lounge Antico*`,
    ``,
    `👤 ${r.name}`,
    `📞 ${r.phone}`,
    `📅 ${r.date} · ${r.time}`,
    r.order_type === 'dine-in' ? `👥 ${r.guests} პირი` : `📦 წასაღებად`,
    itemsList ? `\n🍽️ შეკვეთა:\n${itemsList}\n💰 სულ: ₾${r.pre_order_total}` : '',
    r.message ? `\n💬 ${r.message}` : '',
  ].filter(Boolean).join('\n')

  await sendWhatsApp(waMessage)

  // Email
  const itemsHtml = (r.pre_order_items || []).length > 0
    ? `<table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${r.pre_order_items.map((i: { name: string; quantity: number; price: number }) =>
          `<tr><td style="padding:4px 0;color:#aaa">${i.name} × ${i.quantity}</td><td style="text-align:right;color:#c9a84c">₾${(i.price * i.quantity).toFixed(2)}</td></tr>`
        ).join('')}
        <tr style="border-top:1px solid #333"><td style="padding-top:6px;color:#fff;font-weight:bold">სულ</td><td style="padding-top:6px;text-align:right;color:#c9a84c;font-weight:bold">₾${r.pre_order_total}</td></tr>
      </table>`
    : '<p style="color:#666;font-size:13px">წინასწარი შეკვეთა არ არის</p>'

  const html = `
    <div style="background:#111;color:#eee;font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #333">
      <div style="color:#c9a84c;font-size:22px;font-weight:bold;margin-bottom:4px">Lounge Antico</div>
      <div style="color:#666;font-size:13px;margin-bottom:24px">ახალი ჯავშანი</div>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="color:#888;padding:6px 0;width:120px">სახელი</td><td style="color:#fff">${r.name}</td></tr>
        <tr><td style="color:#888;padding:6px 0">ტელეფონი</td><td style="color:#fff">${r.phone}</td></tr>
        <tr><td style="color:#888;padding:6px 0">ელ. ფოსტა</td><td style="color:#fff">${r.email}</td></tr>
        <tr><td style="color:#888;padding:6px 0">თარიღი</td><td style="color:#c9a84c">${r.date} · ${r.time}</td></tr>
        <tr><td style="color:#888;padding:6px 0">სტუმრები</td><td style="color:#fff">${r.order_type === 'dine-in' ? r.guests + ' პირი' : '—'}</td></tr>
        <tr><td style="color:#888;padding:6px 0">ტიპი</td><td style="color:#fff">${orderTypeLabel}</td></tr>
        ${r.message ? `<tr><td style="color:#888;padding:6px 0">შენიშვნა</td><td style="color:#fff;font-style:italic">${r.message}</td></tr>` : ''}
      </table>
      ${(r.pre_order_items || []).length > 0 ? `
        <div style="margin-top:20px;border-top:1px solid #333;padding-top:16px">
          <div style="color:#c9a84c;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">შეკვეთა</div>
          ${itemsHtml}
        </div>` : ''}
      <div style="margin-top:24px;padding:12px;background:#1a1a1a;border-left:3px solid #c9a84c;color:#888;font-size:12px">
        ადმინ პანელი: <a href="https://loungeantico.com/admin" style="color:#c9a84c">loungeantico.com/admin</a>
      </div>
    </div>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Lounge Antico <onboarding@resend.dev>',
      to: [RESTAURANT_EMAIL],
      subject: `🍽️ ახალი ჯავშანი — ${r.name} · ${r.date}`,
      html,
    }),
  })

  return new Response('ok', { status: 200 })
})
