import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, date, time, guests, message } = body

    if (!name || !phone || !email || !date || !time) {
      return NextResponse.json({ error: 'ყველა სავალდებულო ველი უნდა იყოს შევსებული' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const restaurantHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1814; color: #f5f0e8; padding: 40px;">
        <h1 style="color: #c9a96e; font-size: 28px; margin-bottom: 8px;">ANTICO</h1>
        <p style="color: #c9a96e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px;">ახალი ჯავშანი</p>
        <hr style="border: 1px solid #2a2620; margin-bottom: 24px;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px; width: 140px;">სახელი</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px;">ტელეფონი</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px;">ელ. ფოსტა</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px;">თარიღი</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px;">დრო</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px;">სტუმრები</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${guests} პირი</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 8px 0; color: #c9a96e; font-size: 12px; vertical-align: top;">შენიშვნა</td>
            <td style="padding: 8px 0; color: #f5f0e8;">${message}</td>
          </tr>` : ''}
        </table>
      </div>
    `

    const guestHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1814; color: #f5f0e8; padding: 40px;">
        <h1 style="color: #c9a96e; font-size: 28px; margin-bottom: 4px;">ANTICO</h1>
        <p style="color: #c9a96e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px;">ჯავშნის დადასტურება</p>
        <hr style="border: 1px solid #2a2620; margin-bottom: 24px;" />

        <p style="color: #f5f0e8; margin-bottom: 16px;">გამარჯობა, <strong style="color: #c9a96e;">${name}</strong>!</p>
        <p style="color: rgba(245,240,232,0.7); line-height: 1.6; margin-bottom: 24px;">
          თქვენი ჯავშანი მიღებულია. ჩვენი გუნდი მალე დაგიკავშირდებათ დასადასტურებლად.
        </p>

        <div style="background: #0f0d0a; border: 1px solid #2a2620; padding: 24px; margin-bottom: 24px;">
          <p style="color: #c9a96e; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">ჯავშნის დეტალები</p>
          <p style="color: #f5f0e8; margin: 8px 0;">📅 ${date} — ${time}</p>
          <p style="color: #f5f0e8; margin: 8px 0;">👥 ${guests} სტუმარი</p>
        </div>

        <p style="color: rgba(245,240,232,0.5); font-size: 13px;">
          კითხვების შემთხვევაში: <a href="tel:+995322123456" style="color: #c9a96e;">+995 322 123 456</a>
        </p>

        <hr style="border: 1px solid #2a2620; margin-top: 32px; margin-bottom: 16px;" />
        <p style="color: rgba(245,240,232,0.3); font-size: 11px;">რუსთაველის გამზ. 12, თბილისი | info@antico.ge</p>
      </div>
    `

    await transporter.sendMail({
      from: `"Antico Restaurant" <${process.env.EMAIL_USER}>`,
      to: process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER,
      subject: `ახალი ჯავშანი — ${name} (${date} ${time}, ${guests} პირი)`,
      html: restaurantHtml,
    })

    await transporter.sendMail({
      from: `"Antico Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Antico — ჯავშნის დადასტურება',
      html: guestHtml,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reservation email error:', err)
    return NextResponse.json({ error: 'Email sending failed' }, { status: 500 })
  }
}
