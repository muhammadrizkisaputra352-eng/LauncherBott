import moment from 'moment-timezone'

let handler = async (m, { conn }) => {

  // Jika belum ada payment di config
  if (!global.payment) global.payment = {}

  let teks = `
┏━━━━━━━━━━━❦  ❦━━━━━━━━━━━┓
           💳 *METODE PEMBAYARAN* 💳
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

Halo *${m.pushName}*, berikut metode pembayaran kami:

📱 *E-Wallet*
• Dana: ${global.payment.dana || '-'}
• OVO: ${global.payment.ovo || '-'}
• Gopay: ${global.payment.gopay || '-'}

🏦 *Bank Transfer*
• BCA: ${global.payment.bca || '-'}
• BRI: ${global.payment.bri || '-'}
• Mandiri: ${global.payment.mandiri || '-'}

📌 Setelah transfer, kirim bukti yah Kak


📆 ${moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')}
⏰ ${moment.tz('Asia/Jakarta').format('HH:mm')} WIB

Terima kasih telah berbelanja 💛
`

  // Kirim gambar + teks
  await conn.sendMessage(
    m.chat,
    {
      image: { url: './media/thumnail.jpg' }, // ganti sesuai foto kamu
      caption: teks
    },
    { quoted: m }
  )
}

handler.command = ['pay', 'payment']
handler.help = ['pay', 'payment']
handler.tags = ['store']

export default handler