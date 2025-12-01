import axios from "axios"

let handler = async (m, { text, usedPrefix, command, conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    // Brat tidak butuh gambar, jadi abaikan mime check
    if (!text) return m.reply(`Contoh: *${usedPrefix + command} halo dunia*`)

    try {
        m.reply("Wait...")

        // API brat
        const url = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text)}`

        // Download gambar brat
        const res = await fetch(url)
        const buffer = Buffer.from(await res.arrayBuffer())

        // Exif packname seperti handler sticker asli
        let exif = {}
        if (text) {
            const [packname, author] = text.split(/[,|\-+&]/)
            exif = { packName: packname || '', packPublish: author || '' }
        }

        // Kirim sebagai sticker
        await conn.sendSticker(m.chat, buffer, m, exif)

    } catch (e) {
        m.reply(e.message)
    }
}

handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^brat$/i
handler.register = true

export default handler