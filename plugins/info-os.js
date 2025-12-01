import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
  try {
    const start = performance.now()
    const msg = await conn.reply(m.chat, '🕒 *Mengecek kecepatan sistem...*', m)
    const end = performance.now()
    const speed = (end - start).toFixed(2)

    const os = process.platform
    const uptime = process.uptime()
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2)

    const formatTime = (s) => {
      const pad = (n) => (n < 10 ? '0' : '') + n
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = Math.floor(s % 60)
      return `${pad(h)}:${pad(m)}:${pad(sec)}`
    }

    const teks = `
╭━━━〔 ⚙️ *BOT SYSTEM STATUS* 〕━━━╮
│ 🧠 *OS:* ${os}
│ ⚡ *Speed:* ${speed} ms
│ ⏳ *Uptime:* ${formatTime(uptime)}
│ 💾 *RAM:* ${ram} MB
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`

    await conn.sendMessage(m.chat, { text: teks }, { quoted: msg })
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Terjadi kesalahan saat cek sistem.', m)
  }
}

handler.help = ['os']
handler.tags = ['info']
handler.command = /^os$/i
handler.register = true

export default handler