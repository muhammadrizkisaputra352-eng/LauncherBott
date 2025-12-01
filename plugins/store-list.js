import { sendInteractiveMessage } from "buttons-warpper"
import moment from "moment-timezone"

const handler = async (m, { conn }) => {

  // Jika belum ada database produk
  if (!global.db.data.storeProduk) global.db.data.storeProduk = [];

  let produk = global.db.data.storeProduk;

  if (produk.length === 0) {
    return m.reply("❗ Belum ada produk. Tambahkan dulu dengan:\n.addlist HEADER|NAMA PRODUK|DESKRIPSI");
  }

  // Convert produk ke bentuk rows
  let rows = produk.map(p => ({
    header: p.header,
    title: p.title,
    description: p.description,
    id: p.id // default .owner
  }));

  let teks = `
🛒 *Selamat datang di Store, ${m.pushName}!*

Silakan pilih produk yang ingin kamu cek.

📆 *Tanggal:* ${moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')}
⏰ *Waktu:* ${moment.tz('Asia/Jakarta').format('HH:mm')}
`;

  await sendInteractiveMessage(conn, m.chat, {
    text: teks,
    footer: "Pilih produk untuk menghubungi admin",
    interactiveButtons: [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Daftar Produk",
          sections: [
            {
              title: "Produk Tersedia",
              rows
            }
          ]
        })
      }
    ]
  });

};

handler.help = ['listproduk']
handler.tags = ['store']
handler.command = /^listproduk$/i

export default handler