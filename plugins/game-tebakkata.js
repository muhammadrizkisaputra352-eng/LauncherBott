const sesiTebak = {}

let handler = async (m, { conn, command, text }) => {
  const id = m.sender

  // =========================
  // JAWABAN: .pasti <jawaban>
  // =========================
  if (command === "pasti") {
    if (!sesiTebak[id]) 
      return m.reply("⚠ Kamu belum bermain tebak kata.\nKetik *.tebakkata* untuk memulai.")

    if (!text) 
      return m.reply("⚠ Gunakan: *.pasti <jawaban>*")

    let jawabanUser = text.toLowerCase().trim()
    let data = sesiTebak[id]
    let jawabanBenar = data.jawaban.toLowerCase().trim()

    if (jawabanUser === jawabanBenar) {
      clearTimeout(data.timeout)
      clearTimeout(data.hintTimeout)
      delete sesiTebak[id]

      return conn.sendMessage(m.chat, { 
        text: `🎉 *Jawaban benar!*` 
      }, { quoted: m })
    } else {
      // ❌ JAWABAN SALAH → GENERATE HINT TAMBAHAN
      data.salahCount++
      
      const revealCount = Math.min(data.salahCount, data.jawaban.length)
      const revealed = data.jawaban
        .slice(0, revealCount)
        .padEnd(data.jawaban.length, "_")

      return conn.sendMessage(m.chat, { 
        text: `❌ Salah!\n💡 Hint tambahan: *${revealed}*`
      }, { quoted: m })
    }
  }

  // =========================
  // MULAI GAME: .tebakkata
  // =========================
  if (command === "tebakkata") {
    try {
      let res = await fetch(`https://api-faa.my.id/faa/lengkapikalimat`)
      let json = await res.json()

      if (!json?.result?.pertanyaan || !json?.result?.jawaban) {
        return conn.sendMessage(m.chat, { text: "⚠ API error!" })
      }

      const soal = json.result.pertanyaan
      const jawaban = json.result.jawaban

      // Simpan sesi permainan
      sesiTebak[id] = { 
        soal, 
        jawaban, 
        salahCount: 1 // hint pertama: 1 huruf terbuka
      }

      // Hint awal (1 huruf terbuka)
      const hintAwal = jawaban[0] + "_".repeat(jawaban.length - 1)

      // Kirim soal
      const pesan = `
🎮 *TEBAK KATA – LENGKAPI KALIMAT*

📝 Soal:
${soal}

💡 Hint awal: *${hintAwal}*

⏳ Waktu: *60 detik*

Jawab dengan format:
*.pasti <jawaban>*
      `.trim()

      conn.sendMessage(m.chat, { text: pesan }, { quoted: m })

      // =========================
      // HINT OTOMATIS SETELAH 30 DETIK
      // =========================
      sesiTebak[id].hintTimeout = setTimeout(() => {
        if (sesiTebak[id]) {
          const h = sesiTebak[id].jawaban
          const hintAuto = h[0] + "_".repeat(h.length - 1)

          conn.sendMessage(m.chat, { 
            text: `💡 *HINT TAMBAHAN:*\n${hintAuto}` 
          })
        }
      }, 30000)

      // =========================
      // TIMEOUT GAME → 60 DETIK
      // =========================
      sesiTebak[id].timeout = setTimeout(() => {
        if (sesiTebak[id]) {
          conn.sendMessage(m.chat, { 
            text: `⏳ *Waktu habis!*\nJawaban: *${sesiTebak[id].jawaban}*`
          })
          delete sesiTebak[id]
        }
      }, 60000)

    } catch (e) {
      conn.sendMessage(m.chat, { text: "❌ Terjadi error:\n" + e })
    }
  }
}

handler.command = ["tebakkata", "pasti"]
handler.tags = ["game"]
handler.help = ["tebakkata", "pasti <jawaban>"]

export default handler