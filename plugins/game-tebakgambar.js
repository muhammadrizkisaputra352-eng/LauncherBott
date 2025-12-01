let tebakkHandler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    if (command === 'tebakgambar') {
      // Kirim loading
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

      const res = await fetch('https://api.baguss.xyz/api/game/tebakgambar');
      const data = await res.json();

      if (!data.status) throw new Error('Gagal mengambil soal');

      // Simpan jawaban sementara di db global
      if (!global.db.data.tebakgambar) global.db.data.tebakgambar = {};
      global.db.data.tebakgambar[m.chat] = {
        jawaban: data.jawaban.toUpperCase(),
        timeout: setTimeout(() => {
          conn.sendMessage(m.chat, { text: `⏰ Waktu habis!\nJawaban: ${data.jawaban}` }, { quoted: m });
          delete global.db.data.tebakgambar[m.chat];
        }, 60000) // 60 detik
      };

      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.img },
          caption: `🎮 *Tebak Gambar*\n\n📝 Deskripsi: ${data.deskripsi}\n\nKetik jawaban dengan:\n${usedPrefix}mungkin <jawaban>\n\n⏳ Kamu punya 60 detik!`
        },
        { quoted: m }
      );
    }

    // Handle jawaban
    if (command === 'mungkin') {
      const game = global.db.data.tebakgambar?.[m.chat];
      if (!game) return m.reply('❌ Tidak ada permainan aktif. Ketik *.tebakgambar* untuk mulai.');

      if (!text) return m.reply(`❌ Gunakan: ${usedPrefix}mungkin <jawaban>`);

      if (text.toUpperCase() === game.jawaban) {
        clearTimeout(game.timeout);
        delete global.db.data.tebakgambar[m.chat];
        return m.reply(`✅ Selamat! Jawaban benar: ${game.jawaban}`);
      } else {
        return m.reply('❌ Salah! Coba lagi.');
      }
    }

  } catch (e) {
    console.error(e);
    m.reply('❌ Terjadi kesalahan saat mengambil soal.');
  }
};

tebakkHandler.help = ['tebakgambar', 'jawab <jawaban>'];
tebakkHandler.tags = ['game'];
tebakkHandler.command = ['tebakgambar', 'mungkin'];
handler.register = true
export default tebakkHandler;