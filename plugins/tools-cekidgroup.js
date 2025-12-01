import { proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(
        `❌ Masukkan link grup WhatsApp!\nContoh: ${usedPrefix}${command} https://chat.whatsapp.com/xxxx`
    )

    try {
        // ===== Ambil kode invite dari link =====
        const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]+)/i
        const match = args[0].match(regex)
        if (!match || !match[1]) throw new Error('Link grup tidak valid!')

        const code = match[1]

        // ===== Ambil info grup tanpa join =====
        const info = await conn.groupInviteInfo(code)

        const teks = `
📌 *Info Grup Invite*
• Nama Grup: ${info.subject || 'Tidak tersedia'}
• Jumlah Member (perkiraan): ${info.size || 'Tidak diketahui'}
• ID Grup: ${info.id || 'Tidak diketahui'}
• Link Invite: https://chat.whatsapp.com/${code}
• Expired: ${info.expiration ? new Date(info.expiration * 1000).toLocaleString() : 'Tidak diketahui'}
• Owner: ${info.owner || 'Tidak tersedia'}
        `
        m.reply(teks)
    } catch (e) {
        console.error(e)
        m.reply(`❌ Gagal mengambil info grup: ${e.message}`)
    }
}

handler.help = ['cekidgrub <link>']
handler.tags = ['info']
handler.command = /^cekidgrub$/i

export default handler