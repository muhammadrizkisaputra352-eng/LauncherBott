// upscale.js — By ChatGPT Fix Version

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`📸 *Kirim / Reply gambar*\nContoh:\n${usedPrefix + command} (reply foto)`);
    }

    await m.reply("⏳ *Mengupload gambar ke Uguu...*");

    // === DOWNLOAD GAMBAR DAN UPLOAD KE UGUU ===
    let buffer = await q.download();

    // Bikin FormData manual (untuk Node tanpa import)
    const form = new FormData();
    form.append("files[]", new Blob([buffer]), "image.jpg");

    // Upload ke Uguu
    let up;
    try {
        up = await fetch("https://uguu.se/upload", {
            method: "POST",
            body: form
        }).then(res => res.json());
    } catch (e) {
        console.log(e);
        return m.reply("❌ *Gagal upload ke Uguu!*");
    }

    if (!up || !up.files || !up.files[0] || !up.files[0].url) {
        return m.reply("❌ *Gagal upload ke Uguu!*");
    }

    let imageUrl = up.files[0].url;

    await m.reply("🔍 *Memproses upscale gambar...*");

    // === PROSES UPSCALE API ===
    let api;
    try {
        api = await fetch(`https://api.ootaizumi.web.id/tools/upscale?imageUrl=${encodeURIComponent(imageUrl)}`)
            .then(res => res.json());
    } catch (e) {
        console.log(e);
        return m.reply("❌ *API gagal memproses gambar.*");
    }

    if (!api.status || !api.result || !api.result.imageUrl) {
        return m.reply("❌ *API gagal memproses gambar.*");
    }

    let finalImageUrl = api.result.imageUrl;

    // === KIRIM FOTO KE USER ===
    try {
        let hasil = await fetch(finalImageUrl);
        let buf = Buffer.from(await hasil.arrayBuffer());

        await conn.sendMessage(m.chat, {
            image: buf,
            caption: `✅ *Upscale Berhasil!*\n\n🖼️ Size: ${api.result.size || '-'}`
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        await m.reply("❌ *Gagal mengirim hasil gambar.*");
    }
};

handler.help = ["upscale"];
handler.tags = ["tools"];
handler.command = /^upscale$/i;
handler.register = false;

export default handler;