/**
 ╔══════════════════════
      ⧉  [GSMarena] — [tools]
 ╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
  ✺ Creator  : SXZnightmare
  ✺ API      : [ https://api.zenzxz.my.id ]
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) return m.reply(`*Contoh: ${usedPrefix + command} Infinix Note 40*`);
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://api.zenzxz.my.id/api/search/gsmarena?query=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.success) {
            return m.reply(`*🍂 Gagal mengambil data, coba ulang.*`);
        }

        const d = json.data;
        const prices = d.prices || {};
        const specs = d.specs || {};
        
        let txt = `*📱 GSMArena Phone Specs — ${d.phoneName}*\n\n`;
        txt += `*💰 Harga:*\n`;
        txt += `• *IDR:* ${prices.IDR || '-'}\n`;
        txt += `• *USD:* ${prices.USD || '-'}\n`;
        txt += `• *EUR:* ${prices.EUR || '-'}\n\n`;

        txt += `*⚙️ Spesifikasi Utama:*\n`;
        for (const key in specs) {
        const section = specs[key];
        txt += `\n*${key}:*\n`;
        for (const sub in section) {
        txt += `• *${sub}:* ${section[sub]}\n`;
        }
    }

        await conn.sendMessage(
           m.chat,
           {
        image: { url: d.imageUrl },
        caption: txt
    },
    { quoted: m.quoted ? m.quoted : m }
);
    } catch {
        await m.reply(`*🍂 Terjadi kesalahan saat memproses data.*`);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['gsmarena'];
handler.tags = ['tools'];
handler.command = /^(gsmarena|gsm|spek)$/i;
handler.limit = true;
handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.

export default handler;