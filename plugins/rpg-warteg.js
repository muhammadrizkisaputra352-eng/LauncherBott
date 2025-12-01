/* jangan hapus wm bang 
script by rijalganzz
base? tio nightmare 
whatsapp 62882009507703 ( rijalganzz)
*/
const orders = [
  'nasi goreng', 'ayam bakar', 'mie goreng', 'nasi uduk',
  'sate', 'bakso', 'soto', 'gado-gado'
]

const wartegs = {}
const cooldown = 30 * 60 * 1000

function getRandomReward(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const handler = async (m, { conn }) => {
  const command = m.text.split(' ')[0].toLowerCase()
  const user = m.sender
  const chatId = m.chat

  wartegs[chatId] ??= {}
  wartegs[chatId][user] ??= {
    isOpen: false,
    currentOrder: null,
    money: 0,
    exp: 0,
    common: 0,
    uncommon: 0,
    customerCount: 0,
    timer: null,
    interval: null
  }

  global.db.data.users[user] ??= {
    money: 0,
    exp: 0,
    common: 0,
    uncommon: 0,
    lastClosed: 0
  }

  const newCustomer = () => {
    if (!wartegs[chatId][user].isOpen) return
    const order = orders[Math.floor(Math.random() * orders.length)]
    wartegs[chatId][user].currentOrder = order
    conn.reply(chatId, `⟣───「 *PESANAN* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${wartegs[chatId][user].customerCount + 1}/5 ]
 │📝 [ *Makanan* : ${order} ]
⟣──────────⟢

Ketik .pesanan <makanan>`, m)

    wartegs[chatId][user].timer = setTimeout(() => {
      if (wartegs[chatId][user].isOpen && wartegs[chatId][user].currentOrder) {
        conn.reply(chatId, `Info @${user.replace(/@.+/, '')}, Warteg kamu tutup karena tidak melayani pelanggan tepat waktu.`, m)
        clearInterval(wartegs[chatId][user].interval)
        wartegs[chatId][user].isOpen = false
        wartegs[chatId][user].currentOrder = null
        wartegs[chatId][user].customerCount = 0
        global.db.data.users[user].lastClosed = Date.now()
      }
    }, 3 * 60 * 1000)
  }

  if (command === '.warteg') {
    if (wartegs[chatId][user].isOpen) {
      conn.reply(chatId, `Hey @${user.replace(/@.+/, '')}, Warteg kamu masih buka. Silakan layani pelanggan.`, m)
      return
    }

    const currentTime = Date.now()
    if (currentTime - global.db.data.users[user].lastClosed < cooldown) {
      const remainingTime = cooldown - (currentTime - global.db.data.users[user].lastClosed)
      conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah melayani pelanggan seharian, istirahatlah sejenak\n${Math.ceil(remainingTime / 60000)} menit lagi.`, m)
      setTimeout(() => {
        conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah bisa buka warteg lagi! Ketik .warteg untuk memulai.`, m)
      }, remainingTime)
      return
    }

    wartegs[chatId][user].isOpen = true
    wartegs[chatId][user].customerCount = 0
    conn.reply(chatId, 'Warteg dibuka! Siap-siap melayani pelanggan setiap 3 menit.\n\nKetik .tutup untuk mengakhiri permainan', m)

    newCustomer()
    wartegs[chatId][user].interval = setInterval(() => {
      if (wartegs[chatId][user].isOpen) newCustomer()
    }, 3 * 60 * 1000)
  } else if (command === '.pesanan') {
    if (!wartegs[chatId][user].isOpen) {
      conn.reply(chatId, `Aduh @${user.replace(/@.+/, '')}, Warteg kamu belum buka. Ketik .warteg untuk mulai`, m)
      return
    }

    if (!wartegs[chatId][user].currentOrder) {
      conn.reply(chatId, `Sabar @${user.replace(/@.+/, '')}, Tidak ada pelanggan saat ini. Tunggu pelanggan baru datang.`, null)
      return
    }

    const userOrder = m.text.split(' ').slice(1).join(' ').trim().toLowerCase()
    if (!userOrder) {
      conn.reply(chatId, 'Kamu harus menyertakan nama makanan setelah .pesanan.', m)
      return
    }

    let rewardmoney = 0
    let rewardExp = 0
    let rewardUncommon = 0
    let rewardCommon = 0

    if (userOrder === wartegs[chatId][user].currentOrder) {
      rewardmoney = getRandomReward(10000, 200000)
      rewardExp = getRandomReward(1000, 9999)
      rewardCommon = getRandomReward(100, 120)
      rewardUncommon = getRandomReward(100, 120)
      wartegs[chatId][user].customerCount++
    } else {
      rewardmoney = getRandomReward(-2100000, -100000)
    }

    wartegs[chatId][user].currentOrder = null
    wartegs[chatId][user].money += rewardmoney
    wartegs[chatId][user].exp += rewardExp
    if (rewardmoney >= 0) {
      wartegs[chatId][user].common += rewardCommon
      wartegs[chatId][user].uncommon += rewardUncommon
    }

    global.db.data.users[user].money += rewardmoney
    global.db.data.users[user].exp += rewardExp
    if (rewardmoney >= 0) {
      global.db.data.users[user].common += rewardCommon
      global.db.data.users[user].uncommon += rewardUncommon
    }

    clearTimeout(wartegs[chatId][user].timer)

    const formattedmoney = rewardmoney.toLocaleString()
    const formattedExp = rewardExp.toLocaleString()
    const formattedCommon = rewardCommon.toLocaleString()
    const formattedUncommon = rewardUncommon.toLocaleString()

    const message = `⟣───「 *STATISTIK* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${wartegs[chatId][user].customerCount}/5 ]
 │🏪 [ *Info* : Pesanan ${userOrder} ${rewardmoney < 0 ? 'salah' : 'dilayani'} ]
⟣──────────⟢

⟣───「 *REWARD* 」───⟢
 │💰 Money ${rewardmoney < 0 ? '' : '+'}${formattedmoney}
 │🌟 Exp +${formattedExp}
 │📦 Common +${formattedCommon}
 │📦 Uncommon +${formattedUncommon}
⟣──────────⟢

Tunggu 3 menit untuk pelanggan berikutnya`

    conn.reply(chatId, message, m)

    if (wartegs[chatId][user].customerCount >= 5) {
      conn.reply(chatId, `@${user.replace(/@.+/, '')}, Warteg kamu tutup karena sudah malam setelah melayani 5 pelanggan. Kamu bisa membuka lagi dalam 30 menit.`, m)
      clearInterval(wartegs[chatId][user].interval)
      clearTimeout(wartegs[chatId][user].timer)
      wartegs[chatId][user].isOpen = false
      wartegs[chatId][user].currentOrder = null
      wartegs[chatId][user].customerCount = 0
      global.db.data.users[user].lastClosed = Date.now()

      global.db.data.users[user].money += wartegs[chatId][user].money
      global.db.data.users[user].exp += wartegs[chatId][user].exp
      if (wartegs[chatId][user].money >= 0) {
        global.db.data.users[user].common += wartegs[chatId][user].common
        global.db.data.users[user].uncommon += wartegs[chatId][user].uncommon
      }

      wartegs[chatId][user].money = 0
      wartegs[chatId][user].exp = 0
      wartegs[chatId][user].common = 0
      wartegs[chatId][user].uncommon = 0
    }
  } else if (command === '.tutup') {
    if (!wartegs[chatId][user].isOpen) {
      conn.reply(chatId, 'Warteg kamu sudah tutup atau belum buka.', m)
      return
    }
    clearInterval(wartegs[chatId][user].interval)
    clearTimeout(wartegs[chatId][user].timer)
    wartegs[chatId][user].isOpen = false
    wartegs[chatId][user].currentOrder = null
    wartegs[chatId][user].customerCount = 0
    global.db.data.users[user].lastClosed = Date.now()
    conn.reply(chatId, 'Warteg ditutup.', m)
  }
}

handler.help = ['warteg', 'pesanan <makanan>', 'tutup']
handler.tags = ['game', 'rpg']
handler.command = /^(warteg|pesanan|tutup)$/i
handler.group = true

export default handler