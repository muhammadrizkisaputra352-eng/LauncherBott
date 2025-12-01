const handler = async (m, { text, command, usedPrefix }) => {

    if (!text) {
        return m.reply(
`❗ Format salah!

Contoh:
${usedPrefix + command} Premium Panel`
        );
    }

    // Pastikan database ada
    if (!global.db.data.storeProduk) global.db.data.storeProduk = [];

    let list = global.db.data.storeProduk;

    // Cari produk berdasarkan title
    let index = list.findIndex(p => p.title.toLowerCase() === text.toLowerCase());

    if (index === -1) {
        return m.reply(`❗ Produk *${text}* tidak ditemukan di store.`);
    }

    let removed = list[index];

    // Hapus produk dari database
    list.splice(index, 1);

    m.reply(
`✔ *Produk berhasil dihapus!*

📦 *Produk:* ${removed.title}
🏷️ *Kategori:* ${removed.header}
🗑️ Produk ini sudah tidak muncul di *listproduk*.`
    );
}

handler.help = ['delproduk <nama produk>']
handler.tags = ['store']
handler.command = /^delproduk$/i
handler.owner = true

export default handler