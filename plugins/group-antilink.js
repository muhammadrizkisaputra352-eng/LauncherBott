let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]

    if (!args[0]) {
        return m.reply(
            `🔧 *ANTI-LINK SETTINGS*\n\n` +
            `Status: *${chat.antiLink ? 'ON' : 'OFF'}*\n\n` +
            `Gunakan:\n` +
            `• ${usedPrefix + command} on\n` +
            `• ${usedPrefix + command} off`
        )
    }

    let opt = args[0].toLowerCase()

    if (opt === 'on') {
        chat.antiLink = true
        return m.reply('✅ Anti-Link berhasil *diaktifkan*.')
    }

    if (opt === 'off') {
        chat.antiLink = false
        return m.reply('❌ Anti-Link berhasil *dinonaktifkan*.')
    }

    return m.reply(`Format salah!\nGunakan: ${usedPrefix + command} <on/off>`)
}

handler.help = ['antilink <on/off>']
handler.tags = ['group']
handler.command = /^antilink$/i
handler.admin = true
handler.group = true

export default handler