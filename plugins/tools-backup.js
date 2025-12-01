import fs from "fs"
import { exec } from "child_process"

let handler = async (m, { conn, command }) => {
  try {
    const ownerNumber = global.owner || [] // sesuaikan dengan sc kamu
    if (!ownerNumber) return

    await conn.reply(m.chat, "Sedang membuat backup file...", m)

    const output = `backup_${Date.now()}.zip`

    // Perintah ZIP sesuai kebutuhan
    const zipCmd = `zip -r ${output} . \
      -x "node_modules/*" ".git/*" ".npm/*" ".cache/*" \
      "temp/*" "session/*" "*.zip" "package-lock.json"`

    exec(zipCmd, async (err) => {
      if (err) {
        console.log(err)
        return conn.reply(m.chat, "Gagal membuat file backup", m)
      }

      // Baca hasil ZIP
      const buffer = fs.readFileSync(output)

      await conn.sendMessage(
        m.chat,
        {
          document: buffer,
          fileName: output,
          mimetype: "application/zip"
        },
        { quoted: m }
      )

      fs.unlinkSync(output)
    })

  } catch (err) {
    console.log(err)
    conn.reply(m.chat, "Terjadi kesalahan saat backup", m)
  }
}

handler.help = ["backup"]
handler.tags = ["owner"]
handler.command = /^backup$/i
handler.owner = true

export default handler