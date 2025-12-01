/**
  ✧ loli - random anime loli ✧ ───────────────────────
  𖣔 Type   : Plugin ESM
  𖣔 Source : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
  𖣔 Create by : SXZnightmare (Modified by ChatGPT)
  𖣔 API    : https://api.zenzxz.my.id
*/

let handler = async (m, { conn }) => {
  try {

    // React loading
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Satu proses saja
    let proses = await conn.reply(m.chat, '⏳ *Sedang memproses...*', m)

    // Fetch API
    const apiUrl = 'https://api.zenzxz.my.id/api/random/loli'
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`Status ${res.status} saat menghubungi API`)

    const buffer = Buffer.from(await res.arrayBuffer())

    // Kirim hasil
    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: '🌸 *Loli random sudah datang nih!*'
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await m.reply(`🍂 *Ups error:* ${e.message || e}`)
  } finally {
    // Hapus react
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['loli']
handler.tags = ['random', 'anime']
handler.command = /^loli$/i
handler.register = true

export default handler