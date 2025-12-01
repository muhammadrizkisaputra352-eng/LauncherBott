let handler = async (m, { conn, command, usedPrefix }) => {
  try {
    // React loading ala loli
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Daftar ramalan masa depan
    const futures = [
      'Anda akan menjadi orang yang Kaya, keluarga yang harmonis, memiliki 2 anak, memiliki 4 kendaraan, memiliki 2 rumah',
      'Anda akan menjadi orang yang Sederhana, keluarga yang harmonis, memiliki 3 anak, memiliki 1 kendaraan, memiliki 1 rumah',
      'Anda akan menjadi orang yang Miskin, keluarga yang Sederhana, memiliki 1 anak, tidak memiliki kendaraan, rumah ngontrak',
      'Anda akan menjadi orang yang Sederhana, keluarga yang dicerai, memiliki 5 anak, memiliki 2 kendaraan, memiliki 2 rumah',
      'Anda akan menjadi orang yang Sederhana, keluarga yang Sederhana, memiliki 2 anak, memiliki 2 kendaraan, memiliki 1 rumah',
      'Anda akan menjadi orang yang Sangat Kaya, keluarga yang Sangat Harmonis, memiliki 5 anak, memiliki 7 kendaraan, memiliki 9 rumah',
      'Anda akan menjadi orang yang Sangat Miskin, keluarga yang Sederhana, memiliki 9 anak, tidak memiliki kendaraan, rumah ngontrak',
      'Anda akan menjadi orang yang Sederhana keluarga yang Sederhana, memiliki 2 anak kembar dan 1 anak lagi, memiliki 1 kendaraan, memiliki 1 rumah'
    ];

    // Pilih ramalan secara random
    const ramalan = futures[Math.floor(Math.random() * futures.length)];

    const teks = `*_🎐 Menurut Ramalan Bot.._*\n\nMasa Depan: ${ramalan}`;

    // Kirim hasil
    await conn.sendMessage(m.chat, { text: teks }, { quoted: m });

    // Hapus react
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });

  } catch (e) {
    console.error('MASA DEPAN ERROR:', e);
    await conn.sendMessage(m.chat, { text: `❌ Terjadi error: ${e.message}` }, { quoted: m });
  }
}

handler.help = ['masadepan'];
handler.tags = ['fun'];
handler.command = /^masadepan/i;

export default handler;