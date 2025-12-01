/*
Fitur : Play YT
Note : Gas cobain, putar musiknya 😎
Req fitur gasken langsung aja tag saya :
https://chat.whatsapp.com/KxRm9Sb1HC7DniozVhqtvh?mode=hqrt1
*/

import axios from "axios"
import fs from "fs"

async function downloadYoutube(url) {
  const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data.success) throw new Error("Download gagal")
  return data.data
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) return m.reply(`${usedPrefix}${command} <judul/url>`)

    let query = args.join(" ")
    let ytUrl = query

    if (!/https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i.test(query)) {
      const results = await axios.get(
        `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`,
        { timeout: 20000 }
      )
      if (!results.data.results.length) throw new Error("Not found")
      ytUrl = results.data.results[0].url
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    const info = await downloadYoutube(ytUrl)

    const stream = await axios.get(info.download_url, { responseType: "arraybuffer" })
    await conn.sendMessage(m.chat, {
      audio: Buffer.from(stream.data),
      mimetype: "audio/mpeg",
      fileName: info.title + ".mp3",
      contextInfo: {
        externalAdReply: {
          title: "YP",
          body: "AI",
          thumbnailUrl: info.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: ytUrl
        }
      }
    }, { quoted: m })

    setTimeout(() => {
      conn.sendMessage(m.chat, { react: { text: "", key: m.key } })
    }, 2000)

  } catch (e) {
    console.error("[PLAY ERROR]", e)
    m.reply("Gagal download")
  }
}

handler.help = ["play2 <judul>"]
handler.tags = ["download"]
handler.command = /^(play2)$/i
handler.limit = false

export default handler