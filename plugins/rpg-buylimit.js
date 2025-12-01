/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
const handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]
  let jumlahLimit = parseInt(args[0])

  if (!user.totalGamePlayed) user.totalGamePlayed = 0
  user.totalGamePlayed += 1

  if (!jumlahLimit) {
    return conn.reply(m.chat, 'Masukkan jumlah limit yang ingin dibeli!\nContoh: .buylimit 2', m)
  }

  if (isNaN(jumlahLimit) || jumlahLimit <= 0) {
    return conn.reply(m.chat, 'Jumlah limit harus berupa angka positif!', m)
  }

  const pricePerLimit = 72000
  let totalHarga = jumlahLimit * pricePerLimit

  if (user.hutang > 0) {
    return conn.reply(
      m.chat,
      `❌ Anda tidak dapat membeli limit karena masih memiliki hutang sebesar ${user.hutang.toLocaleString()} money.\nHarap lunasi hutang Anda terlebih dahulu.`,
      m
    )
  }

  if (user.money < totalHarga) {
    return conn.reply(
      m.chat,
      `Uang Anda tidak cukup!\nHarga ${jumlahLimit} limit adalah ${totalHarga.toLocaleString()} money.\nUang Anda saat ini: ${user.money.toLocaleString()}`,
      m
    )
  }

  user.money -= totalHarga
  user.limit += jumlahLimit

  conn.reply(
    m.chat,
    `✅ Berhasil membeli ${jumlahLimit} limit seharga ${totalHarga.toLocaleString()} money!\nSisa uang Anda: ${user.money.toLocaleString()}\nTotal limit Anda: ${user.limit}`,
    m
  )
}

handler.help = ['buylimit <jumlah>']
handler.tags = ['rpg']
handler.command = /^buylimit$/i

export default handler