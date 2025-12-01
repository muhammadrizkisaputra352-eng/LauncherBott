/**
 ╔══════════════════════
      ⧉  [Copilot(Gpt5)] — [ai]
 ╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029Vb5vz4oDjiOfUeW2Mt03
  ✺ Creator  : SXZnightmare
  ✺ API      : [ https://theresapis.vercel.app ]
 ✺ Req      : Z7 (62823××××)
 ✺ Note     :  Copilot model gpt-5 (aku hanya buat:)
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) return m.reply(`*Contoh: ${usedPrefix + command} Keunggulan keyboard Titan Elite*`);
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(text)}&model=gpt-5`;
        const r = await fetch(url);
        const j = await r.json();
        if (!j?.status || !j?.result) {
            return m.reply(`*🍂 Terjadi kesalahan saat memproses permintaan.*`);
        }

        const jawab = j.result.text || 'Tidak ada hasil.';
        const cites = j.result.citations || [];
        let caption = `*🤖 Jawaban dari Gpt-5*\n\n`;
        caption += `${jawab}\n\n`;
        if (cites.length > 0) {
            caption += `*🔗 Referensi:*\n`;
            for (let i of cites.slice(0, 10)) {
                caption += `• *${i.title}*\n${i.url}\n\n`;
            }
        }

        await conn.sendMessage(
            m.chat,
            { text: caption },
            { quoted: m.quoted ? m.quoted : m }
        );

    } catch (e) {
        console.log(e);
        await m.reply(`*🍂 Terjadi kesalahan internal, coba lagi.*`);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['gpt5'];
handler.tags = ['ai'];
handler.command = /^(gpt5)$/i;
handler.register = true; // true kan jika ada fitur register atau daftar di bot mu.

export default handler;