let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
    let now = new Date() * 1

    user.lastmisi = user.lastmisi || 0
    user.money = user.money || 0
    user.exp = user.exp || 0
    user.taxy = user.taxy || 0

    let timePassed = now - user.lastmisi
    let timeLimit = 3600000
    let remainingTime = timeLimit - timePassed

    let timers = clockString(remainingTime)
    let name = conn.getName(m.sender)
    let id = m.sender
    let kerja = "ᴛᴀxʏ"

    conn.misi = conn.misi || {}

    if (id in conn.misi) {
        return conn.reply(
            m.chat,
            `🚧 ꜱᴇʟᴇꜱᴀɪᴋᴀɴ ᴍɪꜱɪ *${conn.misi[id][0]}* ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ.`,
            m
        )
    }

    if (timePassed > timeLimit) {
        let randomMoney = Math.floor(Math.random() * 1000000)
        let randomExp = Math.floor(Math.random() * 10000)

        let hasil = `
*—[ ʜᴀꜱɪʟ ᴛᴀxʏ ${name} ]—*
➕ 💹 ᴜᴀɴɢ = [ ${randomMoney.toLocaleString()} ]
➕ ✨ ᴇxᴘ = [ ${randomExp.toLocaleString()} ]
➕ 😍 ᴏʀᴅᴇʀ ꜱᴇʟᴇꜱᴀɪ = +1
➕ 📥 ᴛᴏᴛᴀʟ ᴏʀᴅᴇʀ ꜱᴇʙᴇʟᴜᴍɴʏᴀ: ${user.taxy}
`.trim()

        user.money += randomMoney
        user.exp += randomExp
        user.taxy += 1

        setTimeout(() => {
            m.reply("🔍 ᴍᴇɴᴄᴀʀɪ ᴘᴇʟᴀɴɢɢᴀɴ...")
        }, 0)

        conn.misi[id] = [
            kerja,
            setTimeout(() => {
                delete conn.misi[id]
            }, 27000),
        ]

        setTimeout(() => {
            m.reply(hasil)
        }, 27000)

        user.lastmisi = now
    } else {
        m.reply(`⏳ ꜱɪʟᴀᴋᴀɴ ᴛᴜɴɢɢᴜ ${timers} ᴜɴᴛᴜᴋ ʙɪꜱᴀ *${kerja}* ᴋᴇᴍʙᴀʟɪ.`)
    }
}

handler.help = ["taxy"]
handler.tags = ["rpg"]
handler.command = /^(taxy)$/i
handler.register = true
handler.group = false
handler.rpg = true

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(":")
}

export default handler