const handler = async (m, { conn }) => {
    const chat = db.data.chats[m.chat];
    if (!chat.totalUserBot) chat.totalUserBot = {}; // Menginisialisasi total user bot

    const participantCounts = chat.totalUserBot;
    const sortedData = Object.entries(participantCounts)
        .sort((a, b) => b[1] - a[1]); // Mengurutkan berdasarkan jumlah pesan

    const totalMessages = sortedData.reduce((sum, [, count]) => sum + count, 0);
    const totalUsers = sortedData.length;

    const messageList = sortedData
        .map(([jid, count], i) => `*${i + 1}.* ${jid.replace(/(\d+)@.+/, '@$1')}: *${count}* pesan`)
        .join('\n');

    const responseMessage = `📊 *Total Pesan yang Dikirim Menggunakan Bot*: *${totalMessages}* pesan dari *${totalUsers}* orang\n\n${messageList}`;

    await m.reply(responseMessage); // Mengirimkan balasan
};

handler.help = ['totaluserbot'];
handler.tags = ['group'];
handler.command = /^(totaluserbot)$/i;
handler.group = true;

handler.before = function (m) {
    if (!m.isGroup) return false; // Memastikan perintah dijalankan di dalam grup

    const chat = db.data.chats[m.chat];
    if (!chat.totalUserBot) chat.totalUserBot = {};
    if (!chat.lastResetUserBot) chat.lastResetUserBot = 0;

    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    // Reset data setiap 30 hari
    if (now - chat.lastResetUserBot > THIRTY_DAYS) {
        chat.totalUserBot = {};
        chat.lastResetUserBot = now;
    }

    // Menghitung pesan yang dikirim oleh bot
    const user = m.sender;
    chat.totalUserBot[user] = (chat.totalUserBot[user] || 0) + 1; // Tambahkan hitungan pesan dari pengguna
};

export default handler;