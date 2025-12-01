/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
let handler = async (m, { conn, text, command, args, usedPrefix, DevMode }) => {
    conn.slots = conn.slots ? conn.slots : {}
    if (m.chat in conn.slots) return m.reply('𝙼𝚊𝚜𝚒𝚑 𝙰𝚍𝚊 𝚈𝚐 𝙱𝚎𝚛𝚖𝚊𝚒𝚗 𝚂𝚕𝚘𝚝 𝙳𝚒𝚜𝚒𝚗𝚒, 𝚃𝚞𝚗𝚐𝚐𝚞 𝚂𝚊𝚖𝚙𝚊𝚒 𝚂𝚎𝚕𝚎𝚜𝚊𝚒!!')
    else conn.slots[m.chat] = true

    try {
        if (args.length < 1) return m.reply(`Gunakan format *${usedPrefix}${command} [jumlah]*\ncontoh *${usedPrefix}${command} 10*`)
        let count = Math.max(parseInt(args[0]) || 1, 1)
        let user = global.db.data.users[m.sender]
        if (user.money < count) return m.reply('Uang kamu tidak cukup untuk bermain slot!')

        user.money -= count

        let spin = () => pickRandom(['1', '2', '3', '4', '5'])
        let toEmoji = num => num == 1 ? '🦁' : num == 2 ? '🐼' : num == 3 ? '🐷' : num == 4 ? '🐮' : '🦊'

        let spins = Array.from({ length: 9 }, () => parseInt(spin()))
        let display = spins.map(toEmoji)

        for (let i = 0; i < 3; i++) {
            await m.reply(`
*🎰ᴠɪʀᴛᴜᴀʟ sʟᴏᴛ🎰*

${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}
${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])} <<==
${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}|${pickRandom(['🦁', '🐼', '🐷', '🐮', '🦊'])}
`)
        }

        let [s1, s2, s3, s4, s5, s6, s7, s8, s9] = spins
        let WinOrLose, Hadiah

        if (spins.every(val => val === s1)) {
            WinOrLose = '𝙹𝚊𝚌𝚔𝚙𝚘𝚝𝚜 𝙱𝚎𝚜𝚊𝚛🥳🥳'
            Hadiah = `+${count * 4}`
            user.money += count * 4
        } else if (s4 === s5 && s5 === s6) {
            WinOrLose = '𝙹𝚊𝚌𝚔𝚙𝚘𝚝𝚜🥳'
            Hadiah = `+${count * 2}`
            user.money += count * 2
        } else if ((s1 === s2 && s2 === s3) || (s7 === s8 && s8 === s9)) {
            WinOrLose = '𝚂𝚎𝚍𝚒𝚔𝚒𝚝 𝙻𝚊𝚐𝚒!!'
            Hadiah = `-${count}`
        } else {
            WinOrLose = '𝙺𝚊𝚖𝚞 𝚔𝚊𝚕𝚊𝚑'
            Hadiah = `-${count}`
        }

        await conn.sendMessage(m.chat, {
            text: `
*🎰ᴠɪʀᴛᴜᴀʟ sʟᴏᴛ🎰*
${display[0]}|${display[1]}|${display[2]}
${display[3]}|${display[4]}|${display[5]} <<==
${display[6]}|${display[7]}|${display[8]}
*${WinOrLose}* *${Hadiah}*
`, 
            quoted: m
        })

    } catch (e) {
        console.log(e)
        m.reply('Terjadi kesalahan.')

        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                await conn.sendMessage(jid, {
                    text: `Slot error\nNo: *${m.sender.split`@`[0]}*\nCommand: *${m.text}*\n\n*${e}*`
                })
            }
        }
    } finally {
        delete conn.slots[m.chat]
    }
}

handler.help = ['slot', 'jackpot']
handler.tags = ['rpg']
handler.command = /^slot?|jac?kpot$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}