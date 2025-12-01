const moneymins = 1

let handler = async (m, { conn, command, args }) => {
  let count = command.replace(/^pull/i, '')
  count = count? /all/i.test(count)? Math.floor(global.db.data.users[m.sender].bank / moneymins) : parseInt(count) : args[0]? parseInt(args[0]) : 1
  count = Math.max(1, count)

  if (global.db.data.users[m.sender].bank >= moneymins * count) {
    const totalWithdrawn = moneymins * count
    global.db.data.users[m.sender].bank -= totalWithdrawn
    global.db.data.users[m.sender].money += count
    const remainingBalance = global.db.data.users[m.sender].bank
    await conn.reply(m.chat, `> 🏦${await func.toRupiah(remainingBalance)}\n> 💰${await func.toRupiah(totalWithdrawn)}`, m)
  } else await conn.reply(m.chat, `💰Your wallet is short of ${await func.toRupiah(count)}!!`, m)
}

handler.help = ['pull', 'pullall'].map(v => v + 'jumlah>')
handler.tags = ['rpg']
handler.command = /^pull([0-9]+)|pull|pullall$/i
handler.limit = false

export default handler