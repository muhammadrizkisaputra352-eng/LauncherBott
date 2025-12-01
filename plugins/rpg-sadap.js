/**
@credit RijalGanzz
@Furina Md
@Whatsapp Bot
wa.me/62882009507703
**/
const pajak = 0.05
const persenSadap = 0.5
const cooldownSadap = 3600000

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const nomors = m.sender
    let who

    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat

    if (!who) return conn.reply(m.chat, '❗ Tag salah satu target untuk disadap.', m)
    if (typeof db.data.users[who] === 'undefined') throw '⚠️ Target tidak ditemukan di database.'
    if (who === m.sender) return conn.reply(m.chat, '❗ Kamu tidak bisa sadap diri sendiri!', m)

    const users = global.db.data.users

    if (!users[m.sender].lastsadap) users[m.sender].lastsadap = 0

    const __timers = new Date() - users[m.sender].lastsadap
    const _timers = cooldownSadap - __timers
    const timers = clockString(_timers)

    if (__timers < cooldownSadap)
        return conn.reply(m.chat, `⏳ Tunggu ${timers} sebelum menyadap lagi.`, m)

    const targetMoney = users[who].money || 0
    const targetBank = users[who].bank || 0

    if (targetMoney <= 0 && targetBank <= 0)
        return conn.reply(m.chat, '💸 Target tidak punya uang ataupun saldo bank!', m)

    const sadapMoney = Math.floor(targetMoney * persenSadap)
    const sadapBank = Math.floor(targetBank * persenSadap)

    const totalSadap = sadapMoney + sadapBank
    const pajakSadap = Math.floor(totalSadap * pajak)
    const hasilBersih = totalSadap - pajakSadap

    users[who].money -= sadapMoney
    users[who].bank -= sadapBank
    users[m.sender].money += hasilBersih

    users[m.sender].lastsadap = new Date() * 1

    conn.reply(
        m.chat,
        `🎭 **Sadap Berhasil!**
        
🔍 Target: @${who.split`@`[0]}

💰 Sadap dari dompet: *${sadapMoney}*
🏦 Sadap dari bank: *${sadapBank}*
⚖️ Total sadap: *${totalSadap}*

📉 Pajak (${pajak * 100}%): *${pajakSadap}*
✅ Hasil bersih: *${hasilBersih}*

⏳ Cooldown sadap: 1 jam
`,
        m,
        { mentions: [who] }
    )
}

handler.help = ['sadap *@user*']
handler.tags = ['rpg']
handler.command = /^sadap$/i
handler.premium = true
handler.group = true

export default handler

function clockString(ms) {
    if (ms < 0) ms = 0
    const h = Math.floor(ms / 3600000)
    const m = Math.floor(ms / 60000) % 60
    const s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}