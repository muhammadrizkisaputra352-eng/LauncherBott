import axios from 'axios';
import ytSearch from 'yt-search';

const handler = async (m, { conn, usedPrefix, text, command }) => {
    if (!text) return m.reply(
`⚠️ Ketikkan nama lagu atau URL YouTube yang ingin diunduh.

Contoh:
${usedPrefix + command} dj nina
${usedPrefix + command} https://youtu.be/iQo-8wx0l0Y`
    );

    try {
        let videoUrl = text;
        
        if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
            const search = await ytSearch(text);
            const video = search.all[0];

            if (!video) return m.reply('❌ Lagu yang Anda cari tidak ditemukan.');

            videoUrl = video.url;
            
            const detail = 
`🎵 *YouTube MP3 Downloader*

📌 *Judul:* ${video.title}
👤 *Channel:* ${video.author.name}
📅 *Upload:* ${video.ago}
👁️ *View:* ${video.views}
🔗 *Link:* ${videoUrl}

⏳ *Sedang mengunduh...*`;

            await conn.sendMessage(m.chat, { text: detail }, { quoted: m });
        }

        const apiUrl = `https://api-faa.my.id/faa/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result || !data.result.mp3) {
            return m.reply('❌ Gagal mengunduh audio.');
        }

        const { title, thumbnail, duration, mp3 } = data.result;

        await conn.sendMessage(m.chat, {
            document: { url: mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: 
`✅ *Berhasil didownload!*

📌 *Judul:* ${title}`
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply(`❌ Terjadi kesalahan:\n${error.message}`);
    }
};

handler.help = ['play2'].map(v => v + ' <judul/url>');
handler.tags = ['downloader'];
handler.command = /^(play2|ytmp3-v2|music2|song2)$/i;

export default handler;