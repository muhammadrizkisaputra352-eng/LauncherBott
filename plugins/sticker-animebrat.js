let handler = async (m, { conn, text, command, isBan }) => {
  if (isBan) return m.reply('🚫 Kamu dibanned!')
  if (!text) return m.reply(`📌 Usage:\n.${command} teks\nContoh:\n.${command} aku suka anime`)

  const api = `https://api.elrayyxml.web.id/api/maker/bratanime?text=${encodeURIComponent(text)}`
  try {
    const res = await fetch(api)
    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    const contentType = (res.headers.get?.('content-type') || '').toLowerCase()

    // jika API mengembalikan JSON yang berisi URL
    let imageURL = null
    if (contentType.includes('application/json')) {
      const json = await res.json()
      imageURL = json.result || json.url || json.image || null
      if (!imageURL) throw new Error('API tidak mengembalikan URL gambar')
    } else {
      // API mungkin langsung mengembalikan gambar (binary)
      // kita akan mengirim binary tersebut
      const arr = await res.arrayBuffer()
      const buffer = Buffer.from(arr)

      // coba beberapa method untuk kirim sebagai sticker
      // 1) sendImageAsSticker (beberapa bot punya)
      if (typeof conn.sendImageAsSticker === 'function') {
        try {
          await conn.sendImageAsSticker(m.chat, buffer, m, { packname: 'Yareu-MD', author: 'AnimeBrat' })
          return
        } catch (e) {
          // jatuhkan ke fallback
          console.log('sendImageAsSticker error ->', e.message)
        }
      }

      // 2) sendSticker (kadang ada helper)
      if (typeof conn.sendSticker === 'function') {
        try {
          await conn.sendSticker(m.chat, buffer, m, { packname: 'Yareu-MD', author: 'AnimeBrat' })
          return
        } catch (e) {
          console.log('sendSticker error ->', e.message)
        }
      }

      // 3) kirim sebagai sticker field (butuh buffer webp)
      try {
        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        return
      } catch (e) {
        console.log('sendMessage sticker field error ->', e.message)
      }

      // 4) fallback — kirim sebagai image biasa
      await conn.sendMessage(
        m.chat,
        { image: buffer, caption: `✨ Hasil (fallback gambar). Perhatian: Sticker tidak tersedia di instance ini.` },
        { quoted: m }
      )
      return
    }

    // jika kita mendapatkan imageURL (string)
    // unduh gambarnya dulu jadi buffer lalu sama langkah di atas
    try {
      const imgRes = await fetch(imageURL)
      if (!imgRes.ok) throw new Error(`Gagal mengunduh gambar: ${imgRes.status}`)
      const arr = await imgRes.arrayBuffer()
      const buffer = Buffer.from(arr)

      if (typeof conn.sendImageAsSticker === 'function') {
        try {
          await conn.sendImageAsSticker(m.chat, buffer, m, { packname: 'Yareu-MD', author: 'AnimeBrat' })
          return
        } catch (e) { console.log('sendImageAsSticker error ->', e.message) }
      }

      if (typeof conn.sendSticker === 'function') {
        try {
          await conn.sendSticker(m.chat, buffer, m, { packname: 'Yareu-MD', author: 'AnimeBrat' })
          return
        } catch (e) { console.log('sendSticker error ->', e.message) }
      }

      try {
        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        return
      } catch (e) { console.log('sendMessage sticker field error ->', e.message) }

      await conn.sendMessage(m.chat, { image: buffer, caption: '✨ Hasil (fallback gambar). Instance ini tidak mendukung kirim sticker otomatis.' }, { quoted: m })
      return

    } catch (e) {
      throw new Error('Gagal mengunduh gambar dari URL: ' + e.message)
    }

  } catch (err) {
    console.error(err)
    return m.reply('❌ Error: ' + (err.message || String(err)))
  }
}

handler.help = ['animebrat <teks>']
handler.tags = ['maker','sticker']
handler.command = ['animebrat','bratanim','bratanime']
export default handler