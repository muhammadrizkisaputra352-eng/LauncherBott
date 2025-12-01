/*
fitur: bartv2
api: https://api-faa.my.id/faa/brathd
creator: Z7
*/
let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) return m.reply(`💬 Contoh penggunaan:\n${usedPrefix + command} Halo dunia`);

    try {
        await m.reply("⏳ Membuat stiker, tunggu sebentar...");

        // API baru brat HD
        const apiUrl = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('❌ Gagal mengambil stiker dari API');

        const buffer = Buffer.from(await res.arrayBuffer());

        // Metadata stiker optional
        let exif = {};
        if (text.includes(",")) {
            const [packname, author] = text.split(",");
            exif = { packName: packname.trim(), packPublish: author.trim() };
        }

        // Kirim stiker ke chat
        await conn.sendSticker(m.chat, buffer, m, exif);

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal membuat stiker, coba lagi nanti.');
    }
};

handler.help = ['bartv2'];
handler.tags = ['sticker'];
handler.command = /^(bartv2)$/i;
handler.register = true;
handler.limit = true;

export default handler;