import axios from "axios"
import FormData from "form-data"

// Handler mengikuti pola mentahan kamu
let handler = m => m

// Regex link
let linkRegex = /https?:\/\/whatsapp\.com\/channel\//i
let groupLinkRegex = /https?:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

handler.before = async function (m, { conn, isBotAdmin, isAdmin }) {
  try {
    // Struktur pengecekan mengikuti style mentahan kamu
    if ((m.isBaileys && m.fromMe) || m.fromMe) return true
    if (!m.isGroup || isAdmin) return true
    if (!m.chat.endsWith('@g.us')) return true

    let teks = m.text || ""
    if (!(linkRegex.test(teks) || groupLinkRegex.test(teks))) return false

    let chatId = m.chat
    let groupData = global.db.data.chats[chatId]

    if (!groupData.antiLink) return false

    let sender = m.sender
    let tag = '@' + sender.split('@')[0]

    if (!groupData.users) groupData.users = {}
    if (!groupData.users[sender]) groupData.users[sender] = { warn: 0 }

    groupData.users[sender].warn++

    await m.reply(
      `⚠️ *ANTI LINK DETECTED*\n\n` +
      `Pengirim: *${tag}*\n` +
      `Warn: *${groupData.users[sender].warn]}/5*\n\n` +
      `> Kirim link lagi = auto kick`,
      null,
      { mentions: [sender] }
    )

    // Hapus pesan
    if (isBotAdmin) await conn.sendMessage(m.chat, { delete: m.key })

    // Kick jika warn >= 5
    if (groupData.users[sender].warn >= 5) {
      await m.reply(
        `🚫 *ANTI LINK*\n\n` +
        `*${tag}* sudah mencapai 5 warn dan akan dikick.`,
        null,
        { mentions: [sender] }
      )
      await conn.groupParticipantsUpdate(m.chat, [sender], "remove")
      groupData.users[sender].warn = 0
    }

  } catch (e) {
    console.log("AntiLink Error:", e)
  }

  return true
}

handler.help = ['antilink']
handler.tags = ['group']
handler.command = /^(antilink)$/i

export default handler