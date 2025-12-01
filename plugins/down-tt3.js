import fetch from "node-fetch"

let handler = async (m, { conn, args }) => {
    if (!args[0]) 
        return m.reply("Masukkan URL TikTok!\nContoh: *.tiktok https://vt.tiktok.com/xxx/*")

    let url = args[0]

    try {
        m.reply("⏳ Mengunduh video TikTok...")

        // FETCH API NEKOLABS
        let api = await fetch(`https://api.nekolabs.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`)
        let json = await api.json()

        if (!json.success) 
            return m.reply("❌ Gagal memproses API!")

        let result = json.result
        let videoUrl = result.videoUrl
        let title = result.title || "tiktok"

        if (!videoUrl) return m.reply("❌ Gagal mengambil link video TikTok.")

        // DOWNLOAD VIDEO
        let video = await fetch(videoUrl)
        if (!video.ok) throw "Download gagal"

        let buffer = await video.arrayBuffer()
        let file = Buffer.from(buffer)

        await conn.sendMessage(
            m.chat,
            {
                video: file,
                caption: `🎬 *TikTok Downloader*\n\n• Judul: ${title}\n• Author: ${result.author?.name}\n• Sound: ${result.music_info?.title}`
            },
            { quoted: m }
        )

    } catch (e) {
        console.log(e)
        return m.reply("❌ Gagal mengunduh video TikTok.")
    }
}

handler.help = ["tiktok <url>"]
handler.tags = ["downloader"]
handler.command = /^(tiktok|tt)$/i

export default handler