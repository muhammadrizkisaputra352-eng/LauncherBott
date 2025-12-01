let handler = async (m, { command, conn }) => {
  let user = global.db.data.users[m.sender]

  let {
    kucing = 0, kuda = 0, naga = 0, kyubi = 0,
    centaur = 0, rubah = 0, phonix = 0, griffin = 0, serigala = 0,
    makananpet = 0,
    healtkucing = 0, healtkuda = 0, healtnaga = 0, healtkyubi = 0,
    healtcentaur = 0, healtrubah = 0, healtphonix = 0,
    healtgriffin = 0, healtserigala = 0,
    healthkucing = 100, healthkuda = 100, healthnaga = 100, healthkyubi = 100,
    healthcentaur = 100, healthrubah = 100, healthphonix = 100,
    healthgriffin = 100, healthserigala = 100,
  } = user

  let cap = `*〔 P E T  C O N D I T I O N 〕*

*[👤] Pemilik:*
* @${m.sender.replace(/@.+/, '')}

*[🐈] Kucing:*
* *Level:* ${kucing == 0 ? 'Tidak Punya' : `${kucing} / Max 5`}
* *Healt:* ${healtkucing.toLocaleString()} / ${healthkucing.toLocaleString()}

*[🐎] Kuda:*
* *Level:* ${kuda == 0 ? 'Tidak Punya' : `${kuda} / Max 10`}
* *Healt:* ${healtkuda.toLocaleString()} / ${healthkuda.toLocaleString()}

*[🐉] Naga:*
* *Level:* ${naga == 0 ? 'Tidak Punya' : `${naga} / Max 20`}
* *Healt:* ${healtnaga.toLocaleString()} / ${healthnaga.toLocaleString()}

*[🦊] Kyubi:*
* *Level:* ${kyubi == 0 ? 'Tidak Punya' : `${kyubi} / Max 20`}
* *Healt:* ${healtkyubi.toLocaleString()} / ${healthkyubi.toLocaleString()}

*[🦖] Centaur:*
* *Level:* ${centaur == 0 ? 'Tidak Punya' : `${centaur} / Max 20`}
* *Healt:* ${healtcentaur.toLocaleString()} / ${healthcentaur.toLocaleString()}

*[🦊] Rubah:*
* *Level:* ${rubah == 0 ? 'Tidak Punya' : `${rubah} / Max 10`}
* *Healt:* ${healtrubah.toLocaleString()} / ${healthrubah.toLocaleString()}

*[🕊️] Phonix:*
* *Level:* ${phonix == 0 ? 'Tidak Punya' : `${phonix} / Max 15`}
* *Healt:* ${healtphonix.toLocaleString()} / ${healthphonix.toLocaleString()}

*[🦅] Griffin:*
* *Level:* ${griffin == 0 ? 'Tidak Punya' : `${griffin} / Max 15`}
* *Healt:* ${healtgriffin.toLocaleString()} / ${healthgriffin.toLocaleString()}

*[🐺] Serigala:*
* *Level:* ${serigala == 0 ? 'Tidak Punya' : `${serigala} / Max 15`}
* *Healt:* ${healtserigala.toLocaleString()} / ${healthserigala.toLocaleString()}

*[🍬] Makanan Pet:*
* *Makanan:* ${makananpet.toLocaleString()}
`.trim()

  await conn.sendMessage(m.chat, {
    text: cap,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        mediaUrl: '',
        mediaType: 1,
        title: 'M y. P e t s',
        body: '',
        thumbnailUrl: 'https://telegra.ph/file/d6249aa40851107832c9f.png',
        sourceUrl: 'https://whatsapp.com/channel/0029Vb69G8eE50UgA7ZlyV1Q',
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.tags = ['rpg']
handler.help = ['pets', 'mypets']
handler.command = /^(mypets|pets)$/i

export default handler