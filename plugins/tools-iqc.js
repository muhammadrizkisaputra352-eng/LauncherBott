/**
  ✧ iqc - iphone quoted creator ✧ ───────────────────────
  𖣔 Type   : Plugin ESM
  𖣔 Source : Custom IQC Plugin
  𖣔 Create by : Muhammadrizkisaputraaa + ChatGPT
  𖣔 API    : https://brat.siputzx.my.id
*/

let handler = async (m, { conn, args }) => {
  try {

    // Jika tidak ada teks
    if (!args[0]) 
      return m.reply('*Contoh:* .iqc Di Jual 500p Per Image😋')

    // React proses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Efek proses (optional tapi keren)
    await m.reply(' *P R O S E S..*')
    
    // Waktu lokal WIB (UTC+7)
    let d = new Date()
    let waktu = new Date(d.getTime() + 7 * 3600000).toLocaleTimeString(
      'id-ID',
      { hour: '2-digit', minute: '2-digit', hour12: false }
    )

    // API URL
    const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
      waktu
    )}&messageText=${encodeURIComponent(args.join(' '))}&carrierName=INDOSAT%20OORE...&batteryPercentage=${
      Math.floor(Math.random() * 100) + 1
    }&signalStrength=4&emojiStyle=apple`

    // Kirim hasil
    await conn.sendMessage(
      m.chat,
      {
        image: { url: apiUrl },
        caption: `✨ *IQC Sukses Dibuat!*\n🕒 ${waktu}`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await m.reply(`🍂 *Ups error:* ${e.message || e}`)
  } finally {
    // Hapus react loading
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['iqc <teks>']
handler.tags = ['downloader']
handler.command = /^iqc$/i
handler.register = true

export default handler