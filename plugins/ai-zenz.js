/**
 ╔══════════════════════
      ⧉  [Zenz] — [ai]
 ╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029Vb5vz4oDjiOfUeW2Mt03
  ✺ Creator  : SXZnightmare
  ✺ API      : [ https://zelapioffciall.koyeb.app ]
  ✺ Req      : Hazel (62851××××)
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            return m.reply(`*Contoh: ${usedPrefix + command} Keunggulan HP Victus 15*`);
        }
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://zelapioffciall.koyeb.app/ai/zenz?text=${encodeURIComponent(text)}`;
        const r = await fetch(url);
        if (!r.ok) {
            return m.reply(`*🍂 Terjadi kesalahan saat menghubungi Zenz Ai.*`);
        }

        const j = await r.json();
        if (!j?.status || !j?.result?.reply) {
            return m.reply(`*🍂 Gagal mendapatkan jawaban dari Zen Ai.*`);
        }

        const reply = j.result.reply;
        await m.reply(
            `*🤖 Zenz Ai Response*\n\n` +
            `${reply}`
        );

    } catch (e) {
        console.log(e);
        await m.reply(`*🍂 Terjadi kesalahan saat memproses permintaan.*`);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['zenz'];
handler.tags = ['ai'];
handler.command = /^(zenz|zen|zai|zenzai)$/i;
handler.register = true; // true kan jika ada fitur register atau daftar di bot mu.

export default handler;