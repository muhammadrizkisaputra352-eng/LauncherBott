async function uploadUguu(buffer, filename) {
  const blob = new Blob([buffer]);
  const form = new FormData();
  form.append("files[]", blob, filename);

  const res = await fetch("https://uguu.se/upload.php", {
    method: "POST",
    body: form
  });

  const json = await res.json();
  return json.files?.[0]?.url || null;
}

let handler = async (m, { conn, text, usedPrefix, command, isBan }) => {
  if (isBan) return m.reply("🚫 Kamu sedang dibanned!");

  if (!text)
    return m.reply(
      `📌 *Usage:*\n` +
      `> ${usedPrefix + command} username|text|like (reply foto)\n\n` +
      `Contoh:\n${usedPrefix + command} John|Halo semua|120`
    );

  const [username, teks, like] = text.split("|");

  if (!username || !teks || !like)
    return m.reply(`Format salah!\nGunakan:\n${usedPrefix + command} nama|teks|like`);

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!/image/.test(mime))
    return m.reply("Reply/kirim gambar untuk dijadikan avatar!");

  let buffer = await q.download();
  let avatarURL = await uploadUguu(buffer, "avatar.jpg");
  if (!avatarURL) return m.reply("❌ Upload foto ke Uguu gagal.");

  await m.reply("⏳ Sedang membuat fake threads...");

  const apiURL =
    `https://api.elrayyxml.web.id/api/maker/fakethreads?username=${encodeURIComponent(username)}` +
    `&avatar=${encodeURIComponent(avatarURL)}` +
    `&text=${encodeURIComponent(teks)}` +
    `&count_like=${encodeURIComponent(like)}`;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 20000);

    let res = await fetch(apiURL, { signal: controller.signal });

    if (!res.ok) return m.reply(`❌ API Error: ${res.status}`);

    let arr = await res.arrayBuffer();

    if (arr.byteLength < 5000)
      return m.reply("❌ API mengirimkan data tidak valid (mungkin sedang down).");

    let img = Buffer.from(arr);

    await conn.sendMessage(
      m.chat,
      { image: img, caption: "✨ Fake Threads berhasil dibuat!" },
      { quoted: m }
    );
  } catch (e) {
    if (e.name === "AbortError")
      return m.reply("⏳ API terlalu lama merespon (timeout).");

    return m.reply("❌ Terjadi kesalahan: " + e.message);
  }
};

handler.help = ["faketh", "fakethreads", "fth"].map(v => v + " <username|teks|like>");
handler.tags = ["maker", "tools", "fun"];
handler.command = ["faketh", "fakethreads", "fth"];
handler.register = true

export default handler;