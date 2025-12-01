/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from "@whiskeysockets/baileys"
import fetch from 'node-fetch'

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `🎉 Free Fire RPG ${global.namebot} ✨`,
    }
}

const ffCharacters = [
    { name: 'Kelly', skill: 'Dash', tagline: 'Si Cepat', imageUrl: 'https://telegra.ph/file/f787b47d56941b8fdd221.jpg' },
    { name: 'Andrew', skill: 'Armor Specialist', tagline: 'Sang Pelindung', imageUrl: 'https://telegra.ph/file/8904062b17875a2ab2984.jpg' },
    { name: 'Hayato', skill: 'Bushido', tagline: 'Samurai One Shot', imageUrl: 'https://telegra.ph/file/a65184a676cd648de34c3.jpg' },
    { name: 'Moco', skill: 'Hacker\'s Eye', tagline: 'Detektif Pintar', imageUrl: 'https://telegra.ph/file/2294b7ab49eca8a8046b2.jpg' },
    { name: 'Alok', skill: 'Drop the Beat', tagline: 'Support Legendaris', imageUrl: 'https://telegra.ph/file/180e28807e78419d45537.jpg' }
]

const ffRanks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Grandmaster']
const cooldownFF = 1 * 60 * 60 * 1000

let furina = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    user.ffrpg = user.ffrpg || {}
    user.ffrpg.character = user.ffrpg.character || null
    user.ffrpg.kills = user.ffrpg.kills || 0
    user.ffrpg.rank = user.ffrpg.rank || ffRanks[0]
    user.ffrpg.lastPlay = user.ffrpg.lastPlay || 0
    user.money = user.money || 0 
    user.exp = user.exp || 0

    let userName = await conn.getName(m.sender)

    if (!args[0] || !['create', 'choose', 'play', 'profile'].includes(args[0])) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => global.fotorpg || "https://telegra.ph/file/8904062b17875a2ab2984.jpg")
        let oya = `
🌟 SELAMAT DATANG DI FREE FIRE RPG! 🌟

✨ Yuk, rasakan sensasi Battle Royale di sini!

Pilih menu di bawah ya:
• 🔫 ${usedPrefix}ffrpg create: Buat karakter FF-mu!
• 🗺️ ${usedPrefix}ffrpg play: Mulai pertandingan Battle Royale.
• 👤 ${usedPrefix}ffrpg profile: Cek statistik FF-mu.

Ayo Booyah bareng! 🎉
`.trim()

        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({ text: oya }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: `© ${global.namebot} 🌟` }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: `✨ Menu Free Fire!`,
                                subtitle: `Hello, ${userName}!`,
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    { image: { url: pp } },
                                    { upload: conn.waUploadToServer }
                                ))
                            }),
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: `🌸 ${global.namebot} RPG 🌸`,
                                    body: "Pilih Karakter & Booyah!",
                                    mediaType: 1,
                                    sourceUrl: "https://api.rijalganzz.my.id",
                                    thumbnailUrl: global.fotorpg || "https://telegra.ph/file/8904062b17875a2ab2984.jpg",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Menu 🌟",
                                        sections: [{
                                            title: "List Menu",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Buat Karakter", description: "Pilih karakter FF", id: `${usedPrefix}ffrpg create` },
                                                { header: "", title: "Mulai Bermain", description: "Terjun ke medan perang", id: `${usedPrefix}ffrpg play` },
                                                { header: "", title: "Cek Profil", description: "Lihat statistik FF-mu", id: `${usedPrefix}ffrpg profile` }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        })
                    }
                }
            },
            { quoted: fkontak }
        )
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
        return
    }

    if (args[0] === 'create' || args[0] === 'choose') {
        if (user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak sudah punya karakter FF (*${user.ffrpg.character}*) kok! ✨\n\nUntuk bermain, ketik *${usedPrefix}ffrpg play* ya!`, m, { quoted: fkontak })
        }
        if (!args[1]) {
            let charList = ffCharacters.map((char, i) => `• ${i + 1}. *${char.name}* (${char.tagline}) - Skill: ${char.skill}`).join('\n')
            return conn.reply(m.chat, `
🔫 PILIH KARAKTER FREE FIRE! 🔫

✨ Yuk, pilih karakter favoritmu untuk memulai petualangan Battle Royale!

Daftar Karakter:
${charList}

Penggunaan:
${usedPrefix + command} create <nama_karakter>
Contoh: ${usedPrefix}ffrpg create Kelly

Pilih dengan bijak ya, Player! 💖

© ${global.namebot} 2025 ✨`.trim(), m, { quoted: fkontak })
        }
        let chosenCharName = args.slice(1).join(' ').trim()
        let chosenChar = ffCharacters.find(c => c.name.toLowerCase() === chosenCharName.toLowerCase())
        if (!chosenChar) {
            return conn.reply(m.chat, `❌ Karakter "${chosenCharName}" tidak ditemukan. 😥 Pilih dari daftar ya!`, m, { quoted: fkontak })
        }
        user.ffrpg.character = chosenChar.name
        user.ffrpg.kills = 0
        user.ffrpg.rank = ffRanks[0]
        user.ffrpg.lastPlay = 0

        return conn.reply(m.chat, `✅ Selamat! Kakak telah memilih karakter *${chosenChar.name}* (${chosenChar.tagline}) untuk Free Fire RPG! 🎉\n\nSekarang, ketik *${usedPrefix}ffrpg play* untuk memulai pertempuran! 🔫`, m, { quoted: fkontak })
    }
    else if (args[0] === 'play') {
        if (!user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak belum punya karakter FF. Buat dulu dengan *${usedPrefix}ffrpg create* ya! 😥`, m, { quoted: fkontak })
        }
        let timeSinceLastPlay = Date.now() - user.ffrpg.lastPlay
        if (timeSinceLastPlay < cooldownFF) {
            let remainingTime = cooldownFF - timeSinceLastPlay
            return conn.reply(m.chat, `
⏳ COOLDOWN FREE FIRE RPG! ⏳

Kamu baru saja bermain Free Fire. 😥
Tunggu ${formatTime(remainingTime)} lagi sebelum bisa bermain kembali! ✨

Sabar ya, Player! 🌷

© ${global.namebot} 2025 ✨`.trim(), m, { quoted: fkontak })
        }

        await conn.sendMessage(m.chat, { react: { text: '✈️', key: m.key } })
        await conn.reply(m.chat, `🔫 *PERTEMPURAN DIMULAI!* 🔫\n\nKakak *${userName}* terjun dari pesawat di *Bermuda Map*! 🗺️`, m, { quoted: fkontak })
        await sleep(5000)

        let kills = 0
        let survivedTime = 0
        let isBooyah = false
        let eliminatedBy = 'Zona'

        await conn.reply(m.chat, '🎒 *Mendarat dan mulai looting...* Mencari senjata dan armor!', m, { quoted: fkontak })
        await sleep(3000)
        let foundGun = Math.random() < 0.7
        if (foundGun) await conn.reply(m.chat, '✅ Menemukan *Scar-L* dan *Vest Level 3*! Siap tempur! 🔥', m, { quoted: fkontak })
        else await conn.reply(m.chat, '😔 Hanya menemukan *Pistol* dan *Medkit*... harus berhati-hati!', m, { quoted: fkontak })
        await sleep(3000)

        let currentHealth = 100
        let enemyEncounters = Math.floor(Math.random() * 4) + 1
        let battleLog = ''
        for (let i = 0; i < enemyEncounters; i++) {
            let enemyName = pickRandom(['Bot', 'Noob Player', 'Pro Player', 'Cheater'])
            let outcome = Math.random()
            if (outcome < 0.6) {
                kills++
                currentHealth = Math.min(100, currentHealth + 20)
                battleLog += `\n💥 Melawan *${enemyName}* dan berhasil mengeliminasi! Kills: ${kills}`
            } else {
                currentHealth -= Math.floor(Math.random() * 30) + 10
                battleLog += `\n💔 Terkena damage dari *${enemyName}*! HP sisa: ${currentHealth}`
                if (currentHealth <= 0) {
                    eliminatedBy = enemyName
                    break
                }
            }
            await sleep(3000)
        }

        if (currentHealth > 0) {
            await conn.reply(m.chat, '🌪️ Zona mulai menyusut! Bergerak menuju safe zone!', m, { quoted: fkontak })
            await sleep(5000)
            let safe = Math.random()
            if (safe < 0.2 && currentHealth > 0) {
                currentHealth -= Math.floor(Math.random() * 40) + 20
                battleLog += `\n🔥 Terkena damage zona! HP sisa: ${currentHealth}`
                eliminatedBy = 'Zona'
            }
            if (currentHealth <= 0) eliminatedBy = 'Zona'
            await sleep(3000)
        }

        if (currentHealth > 0) {
            isBooyah = Math.random() < 0.5
            if (isBooyah) {
                survivedTime = Math.floor(Math.random() * 20) + 10
                eliminatedBy = 'Booyah!'
            } else {
                survivedTime = Math.floor(Math.random() * 10) + 1
                eliminatedBy = 'Musuh terakhir'
            }
        } else {
            survivedTime = Math.floor(Math.random() * 10) + 1
        }

        let moneyReward = 0
        let expReward = 0
        let rankPoints = 0
        let finalStatus = ''

        if (isBooyah) {
            finalStatus = '🎉 BOOYAH! 🎉'
            moneyReward = getRandomReward(300000, 1000000) + (kills * 50000)
            expReward = getRandomReward(5000, 15000) + (kills * 500)
            rankPoints = getRandomReward(20, 50)
        } else if (currentHealth <= 0) {
            finalStatus = '💀 TERELIMINASI 💀'
            moneyReward = getRandomReward(10000, 50000) + (kills * 10000)
            expReward = getRandomReward(500, 2000) + (kills * 100)
            rankPoints = getRandomReward(-10, 5)
        } else {
            finalStatus = '🏁 PERTEMPURAN SELESAI 🏁'
            moneyReward = getRandomReward(50000, 200000) + (kills * 20000)
            expReward = getRandomReward(1000, 5000) + (kills * 200)
            rankPoints = getRandomReward(-5, 10)
        }

        let currentRankIndex = ffRanks.indexOf(user.ffrpg.rank)
        let newRankIndex = currentRankIndex
        if (rankPoints > 0) {
            newRankIndex = Math.min(ffRanks.length - 1, currentRankIndex + Math.floor(rankPoints / 10))
        } else if (rankPoints < 0) {
            newRankIndex = Math.max(0, currentRankIndex + Math.ceil(rankPoints / 10))
        }
        user.ffrpg.rank = ffRanks[newRankIndex]

        user.money += moneyReward
        user.exp += expReward
        user.ffrpg.kills += kills
        user.ffrpg.lastPlay = Date.now()

        await conn.reply(m.chat, `
🔫 HASIL FREE FIRE RPG! 🔫

Player: ${userName} (${user.ffrpg.character})
Status: ${finalStatus}
Kills: ${kills}
Bertahan: ${survivedTime} menit
Tereliminasi oleh: ${eliminatedBy}

Hadiah:
💰 Money: +Rp ${moneyReward.toLocaleString('id-ID')}
⚡ EXP: +${expReward}
📈 Rank Point: ${rankPoints > 0 ? '+' : ''}${rankPoints} (New Rank: ${user.ffrpg.rank})

Ayo mabar lagi ya, Player! 💖

© ${global.namebot} 2025 ✨`.trim(), m, { quoted: fkontak })

    } else if (args[0] === 'profile') {
        if (!user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak belum punya karakter FF. Buat dulu dengan *${usedPrefix}ffrpg create* ya! 😥`, m, { quoted: fkontak })
        }
        let charInfo = ffCharacters.find(c => c.name === user.ffrpg.character)
        return conn.reply(m.chat, `
👤 PROFIL FREE FIRE RPG! 👤

Player: ${userName}
Karakter: ${user.ffrpg.character} (${charInfo?.tagline || ''})
Skill Karakter: ${charInfo?.skill || 'Tidak diketahui'}
Total Kills: ${user.ffrpg.kills}
Rank: ${user.ffrpg.rank}
Money: Rp ${user.money.toLocaleString('id-ID')}
EXP: ${user.exp.toLocaleString('id-ID')}

Terus Booyah ya, Player! 💪💖

© ${global.namebot || 'Bot'} 2025 ✨`.trim(), m, { quoted: fkontak })
    }
    else {
        return conn.reply(m.chat, `❌ Perintah tidak dikenal. Ketik ${usedPrefix}ffrpg untuk panduan. 😥`, m, { quoted: fkontak })
    }
}

furina.help = ['ffrpg', 'ff', 'freefire'] 
furina.tags = ['game', 'rpg']
furina.command = /^(ffrpg|ff|freefire)$/i
furina.group = true
furina.register = true
furina.limit = true

export default furina

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatTime(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    minutes %= 60
    seconds %= 60
    let result = []
    if (hours > 0) result.push(`${hours} jam`)
    if (minutes > 0) result.push(`${minutes} menit`)
    if (seconds > 0) result.push(`${seconds} detik`)
    return result.join(' ')
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}