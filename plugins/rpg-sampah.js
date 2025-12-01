let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {}

    let kardus = Number(user.kardus) || 0
    let kaleng = Number(user.kaleng) || 0
    let botol = Number(user.botol) || 0
    let plastik = Number(user.plastik || user.pelastik) || 0

    let mentionedJid = [m.sender]

    let nuy = `Sampah di Cast

👤 @${m.sender.replace(/@.+/, '')}

• 📦 *Kardus:* ${kardus.toLocaleString()}
• 🗑️ *Kaleng:* ${kaleng.toLocaleString()}
• 🍼 *Botol:* ${botol.toLocaleString()}
• 🥡 *Plastik:* ${plastik.toLocaleString()}
`.trim()

    conn.reply(m.chat, nuy, null, { contextInfo: { mentionedJid } })
}

handler.help = ['sampah']
handler.tags = ['rpg']
handler.command = /^(sampah)$/i

export default handler