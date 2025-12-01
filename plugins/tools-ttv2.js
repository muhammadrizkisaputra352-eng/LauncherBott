/** Tiktok V2
Join Group Kuu: https://chat.whatsapp.com/Bhwenfkc5Vi3V2kbTKw7WJ
Channel Share Kode: https://whatsapp.com/channel/0029Vb6ru1s2Jl87BaI4RJ1H
**/
const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `*[❗] Example:* ${usedPrefix + command} https://vt.tiktok.com/xxxxxx`;
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        const tiktokData = await tiktokdl(args[0]);
        if (!tiktokData || !tiktokData.result) {
            throw "Gagal mengambil data dari API!";
        }

        const data = tiktokData.result;
        const videoURL = data.download;

        const info = `🎵 *TIKTOK DOWNLOADER*
=======================
📌 *Judul:* ${data.title}
👤 *Uploader:* ${data.author.nickname}
🔗 *Username:* @${data.author.unique_id}
🌍 *Region:* ${data.region}
🆔 *ID:* ${data.id}
=======================`;

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", info, m);
        } else {
            throw "Video tidak tersedia.";
        }

    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        conn.reply(m.chat, `Error: ${error}`, m);
    }
};

handler.help = ['tiktok2 <url>']
handler.tags = ['downloader']
handler.command = /^(tt2|tiktok2)$/i
handler.disable = false
handler.register = true

export default handler

async function tiktokdl(url) {
    const api = `https://api.deline.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`
    const response = await fetch(api)
    return await response.json()
}