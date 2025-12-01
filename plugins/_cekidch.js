function formatLimitReply(name, limitTerpakai, sisaLimit, isOwner, title = "𝐋𝐀𝐔𝐍𝐂𝐇𝐄𝐑-𝐌𝐃") {
  let waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  return {
    text: `╭───❑ ✦ *DOWNLOADER TTMP3* ✦ ❑───╮
┃ 👤 Nama : *${name}*
┃ 📌 Limit Terpakai : ${limitTerpakai}
┃ 📌 Sisa Limit : ${isOwner ? 'UNLIMITED' : sisaLimit}
┃ 🕒 Waktu : ${waktu}
┗━━━━━━━━━━━━━━━━━━⟢`,
    contextInfo: {
      externalAdReply: {
        title,
        body: "𝖅𝕰𝕹𝕹 𝕺𝕱𝕱𝕮",
        mediaType: 1,
        sourceUrl: "https://nabilxiteroffcialll.vercel.app"
      }
    }
  }
}

const handler = async (m, { text, isOwner }) => {
    if (!text) return m.reply("❌ Harap masukkan link channel WhatsApp!");
    
    let user = global.db.data.users[m.sender]
  if (!user) throw '🚫 User tidak ditemukan di database.'

  // Ambil nilai limit dari metadata handler
  const limitTerpakai = handler.limit || 0 
  // --- AKHIR LOGIKA LIMIT ---

  let name = conn.getName(m.sender)
  await conn.sendMessage(
    m.chat,
    formatLimitReply(name, limitTerpakai, user.limit, isOwner, "FITUR CEK ID CH"),
    { quoted: m }
  )
  
  await (m, conn);
  
    if (!text.includes("https://whatsapp.com/channel/")) return m.reply("⚠️ Link tautan tidak valid!");

    let result = text.split("https://whatsapp.com/channel/")[1];
    let res = await conn.newsletterMetadata("invite", result);

    let teks = `
*📌 ID:* ${res.id}
*📢 Nama:* ${res.name}
*👥 Total Pengikut:* ${res.subscribers}
*📌 Status:* ${res.state}
*✅ Verified:* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`;

    return m.reply(teks);
};

handler.help = ["cekidch2"]
handler.tags = ["tools"]
handler.command = ["cekidch", "idch"];
handler.limit = 10
handler.daftar = true
export default handler;