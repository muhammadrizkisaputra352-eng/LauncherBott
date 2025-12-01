let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.sendMessage(m.chat, { text: `💬 Kirim pertanyaan untuk AI.\nContoh:\n${usedPrefix + command} Halo` }, { quoted: m });

    await conn.sendMessage(m.chat, { text: '⏳ Memproses pertanyaan AI...', quoted: m });

    try {
        // 60 detik timeout
        let controller = new AbortController();
        let timeout = setTimeout(() => controller.abort(), 60000);

        let res = await fetch('https://api.nekolabs.web.id/ai/ai4chat/chat?text=' + encodeURIComponent(text), { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`API gagal dengan status ${res.status}`);

        let json = await res.json();
        if (!json.success || !json.result) throw new Error('AI tidak memberikan respons');

        await conn.sendMessage(m.chat, { text: json.result, quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ API gagal merespon. Silakan coba lagi nanti.\nPesan: ${e.message}`, quoted: m });
    }
};

handler.help = ['ai'];
handler.tags = ['ai'];
handler.command = /^ai$/i;
handler.limit = true;

export default handler;