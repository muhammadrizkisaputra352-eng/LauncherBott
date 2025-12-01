let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`💬 Masukkan kata kunci untuk mencari gambar di Pinterest.\nContoh:\n${usedPrefix + command} pemandangan`);

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Panggil API Pinterest
    const apiUrl = `https://api.baguss.xyz/api/search/pinterest?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API gagal dengan status ${res.status}`);
    const json = await res.json();

    if (!json.results || json.results.length === 0) throw new Error("❌ Tidak ditemukan gambar.");

    // Kirim semua gambar hasil pencarian (limit 5)
    for (let i = 0; i < Math.min(5, json.results.length); i++) {
      const pin = json.results[i];
      const caption = `📌 Title: ${pin.title || 'Tidak tersedia'}\n👤 Author: ${pin.author?.fullname || pin.author?.username || 'Unknown'}\n🔗 Pin URL: ${pin.pin_url}`;
      await conn.sendMessage(m.chat, { image: { url: pin.image_url }, caption }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(`⚠️ Terjadi kesalahan: ${err.message}`);
  }
};

handler.help = ['pinterest'];
handler.tags = ['internet', 'search'];
handler.command = /^pinterest$/i;

export default handler;