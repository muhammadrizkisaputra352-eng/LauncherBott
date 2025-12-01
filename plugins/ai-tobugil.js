let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `💬 Kirim URL gambar dengan perintah\nContoh:\n${usedPrefix + command} https://example.com/foto.jpg` },
      { quoted: m }
    );
  }

  await conn.sendMessage(m.chat, { text: '⏳ Memproses gambar, mohon tunggu...', quoted: m });

  try {
    // API membutuhkan parameter 'image'
    const apiUrl = 'https://api.baguss.xyz/api/edits/tobugil?image=' + encodeURIComponent(text);
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.success) {
      return conn.sendMessage(
        m.chat,
        { text: `❌ API gagal memproses gambar. Pesan: ${json.message || 'Coba lagi nanti.'}`, quoted: m }
      );
    }

    // Kirim URL hasil ke user, tanpa fetch gambar
    await conn.sendMessage(
      m.chat,
      { text: `✅ URL hasil tobugil:\n${json.url}` },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    await conn.sendMessage(
      m.chat,
      { text: `❌ Terjadi kesalahan: ${err.message}`, quoted: m }
    );
  }
};

handler.help = ['tobugil'];
handler.tags = ['edits'];
handler.command = /^(tobugil)$/i;

export default handler;