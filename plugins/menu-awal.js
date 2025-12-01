import fs from 'fs'

let handler = async (m, { conn }) => {

    const namaBot = global.namabot || global.namebot || 'MyBot';
    const author = global.author || 'Unknown';
    const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const uptime = process.uptime();

    const formatUptime = (sec) => {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec % 3600) / 60);
        let s = Math.floor(sec % 60);
        return `${h} Jam ${m} Menit ${s} Detik`;
    };

    let text = `
┏━━━━━━━━━━━━━━━━━━
┃   *👋 SELAMAT DATANG*
┗━━━━━━━━━━━━━━━━━━

Halo kak! Selamat datang di *${namaBot}* 👋

📛 *Nama Bot:* ${namaBot}
⏱ *Uptime:* ${formatUptime(uptime)}
📅 *Tanggal:* ${waktu}

Ketik *allmenu* untuk melihat semua fitur bot.
`.trim();

    const style = global.style || ((txt) => txt);
    const replace = global.replace || {};

    await conn.sendMessage(m.chat, {
        document: Buffer.from('YAW :3'),
        fileName: m.pushName,
        fileLength: Date.now(),
        pageCount: new Date().getFullYear(),

        caption: style(
            text.replace(
                new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'),
                (_, name) => '' + replace[name]
            )
        ),

        contextInfo: {
            mentionedJid: conn.parseMention(text),
            forwardingScore: 10,
            isForwarded: true,
            externalAdReply: {
                title: namaBot,
                body: `${namaBot} By ${author}`,
                thumbnail: fs.readFileSync(global.pathResolve('../media/thumbnail.jpg')),
                mediaType: 1,
                renderLargerThumbnail: true,
            },
        },

    }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'start'];

export default handler;