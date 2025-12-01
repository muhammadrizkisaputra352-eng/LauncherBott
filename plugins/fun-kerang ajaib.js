let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return m.reply(`Gunakan: ${usedPrefix}${command} <pertanyaan>`);

    // React loading ala loli
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Pilihan jawaban
    const answers = [
      'Mungkin suatu hari',
      'Tidak juga',
      'Tidak keduanya',
      'Kurasa tidak',
      'Ya',
      'Coba tanya lagi',
      'Tidak ada'
    ];

    // Pilih jawaban random
    const replyText = `"${answers[Math.floor(Math.random() * answers.length)]}."`;

    await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });

    // Hapus react
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });

  } catch (e) {
    console.error('KERANG ERROR:', e);
    await conn.sendMessage(m.chat, { text: `❌ Terjadi error: ${e.message}` }, { quoted: m });
  }
}

handler.help = ['kerang <pertanyaan>', 'kerangajaib <pertanyaan>'];
handler.tags = ['fun'];
handler.command = /^(kulit)?kerang(ajaib)?$/i;

export default handler;