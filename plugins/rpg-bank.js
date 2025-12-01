/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let name = conn.getName(m.sender)
  let caption = `
╭───⎆【 *B A N K  U S E R* 】
│👤 [ *Pemilik:* @${m.sender.split('@')[0]}
│📝 [ *Name:* ${user.registered ? user.name : name}
│💳 [ *Atm:* ${user.atm > 0 ? 'Level ' + user.atm : 'Tidak Punya'}
│🏛️ [ *Bank:* Rp. ${await toRupiah(user.bank)}
│💶 [ *Uang:* Rp. ${await toRupiah(user.money)}
│🎋 [ *Status:* ${user.premiumTime > 0 ? 'Premium' : 'Free'}
│📑 [ *Registered:* ${user.registered ? 'Ya':'Tidak'}
╰──────━━┉─᳀

> *Ingin Menabung?* Ketik _.nabung <jumlah>_
> *Ingin Menarik Uang?* Ketik _.tarik <jumlah>_
`.trim()

  await conn.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: '💸 B a n k u s e r',
        body: name,
        thumbnailUrl: global.media.bank,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['bank']
handler.tags = ['rpg']
handler.command = /^bank$/i
handler.register = true
export default handler

function toRupiah(angka) {
  let reverse = angka.toString().split('').reverse().join('')
  let ribuan = reverse.match(/\d{1,3}/g)
  return ribuan.join('.').split('').reverse().join('')
}