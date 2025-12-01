// jpm.js
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(
            `🔧 *JPM (Jasa Push Member)*\n\n` +
            `Gunakan:\n` +
            `• ${usedPrefix + command} on <pesan>\n` +
            `• ${usedPrefix + command} off`
        )
    }

    let opt = args[0].toLowerCase()

    if (opt === 'on') {
        let text = args.slice(1).join(' ')
        if (!text) return m.reply(`❌ Masukkan teks yang ingin dikirim ke semua grup.`)

        // Panggil function JPM
        await jpmSendAllGroups(conn, text)
        return m.reply(`✅ JPM selesai dijalankan.`)
    }

    if (opt === 'off') {
        return m.reply('❌ JPM dinonaktifkan.')
    }

    return m.reply(`Format salah!\nGunakan: ${usedPrefix + command} <on/off>`)
}

handler.help = ['jpm <on/off>']
handler.tags = ['owner']
handler.command = /^jpm$/i
handler.owner = true

export default handler


// ===== FUNCTION JPM =====
async function jpmSendAllGroups(conn, text) {
    const chats = Object.keys(conn.chats).filter(id => id.endsWith('@g.us'))
    let count = 0

    for (let id of chats) {
        try {
            await conn.sendMessage(id, { text })
            count++
            console.log(`✅ JPM terkirim ke ${id} (${count}/${chats.length})`)
            // Delay 2 detik per grup
            await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (err) {
            console.error(`❌ Gagal mengirim ke ${id}:`, err.message)
        }
    }

    console.log(`🎯 JPM selesai, total grup terkirim: ${count}`)
}