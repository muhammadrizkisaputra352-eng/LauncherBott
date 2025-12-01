import axios from "axios";
import FormData from "form-data";

let handler = async (m, { conn, text, command }) => {
    try {
        if (!text) return m.reply(`⚠️ Contoh:\n.${command} Zen|Halo (reply foto)`);

        // Foto dari reply
        const q = m.quoted && (m.quoted.mimetype || m.quoted.mediaType) ? m.quoted : null;
        if (!q) return m.reply("❌ Reply ke foto untuk dijadikan avatar!");

        const mime = q.mimetype || q.mediaType;
        if (!mime.startsWith("image")) return m.reply("❌ Yang direply harus Gambar!");

        const buffer = await q.download();
        if (!Buffer.isBuffer(buffer)) return m.reply("❌ Gagal mengambil gambar!");

        // Upload avatar ke Nekohime CDN
        const ext = mime.split("/")[1] || "jpg";
        const filename = "avatar_" + Date.now() + "." + ext;

        const form = new FormData();
        form.append("file", buffer, filename);

        let up = await axios.post("https://cdn.nekohime.site/upload", form, {
            headers: form.getHeaders(),
        });

        let uploaded = up?.data?.files?.[0];
        let avatar = uploaded?.url;

        if (!avatar) return m.reply("❌ Upload avatar gagal!");

        // username|caption
        let [username, caption] = text.split("|");
        if (!username || !caption)
            return m.reply(`⚠️ Format:\n.${command} <username>|<caption> (reply foto)`);

        // API Fakestory
        let api = `https://api.elrayyxml.web.id/api/maker/fakestory?username=${encodeURIComponent(username)}&caption=${encodeURIComponent(caption)}&avatar=${encodeURIComponent(avatar)}`;

        // Download hasil dari API
        let img = await axios.get(api, { responseType: "arraybuffer" });
        let result = Buffer.from(img.data);

        // Kirim ulang sebagai foto asli
        await conn.sendMessage(m.chat, {
            image: result,
            caption: `🎭 *Fake Story*\n👤 ${username}\n📝 ${caption}`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("❌ Error: " + e.message);
    }
};

handler.help = ["fakestory <username>|<caption>"];
handler.tags = ["tools"];
handler.command = /^fakestory$/i;
handler.register = true


export default handler;