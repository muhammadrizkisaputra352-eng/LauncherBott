const maxSumbangan = 1000000000000000000000000; // Batas maksimal sumbangan

async function handler(m, { conn, args, usedPrefix, command }) {
    if (conn.sumbangan[m.chat]) return m.reply('Kamu atau ada orang lain yang sedang meminta sumbangan!');

    const count = parseInt(args[0]);

    if (isNaN(count)) return m.reply("⚠️ Masukkan angka jumlah sumbangan.");
    if (count <= 0) return m.reply("⚠️ Jumlah sumbangan harus lebih dari 0.");
    if (count > maxSumbangan) return m.reply(`⚠️ Jumlah sumbangan maksimal adalah *${formatRupiah(maxSumbangan)}*.`);

    let hasil = formatRupiah(count);
    let txt = `Apakah kamu yakin ingin memberi sumbangan?\n✅ (Yes) ❌ (No)`;
    let confirm = `Apakah kamu yakin ingin memberi sumbangan sebesar *${hasil}*?\n\n${txt}`;

    let { key } = await conn.reply(m.chat, confirm, m, { mentions: [m.sender] });

    conn.sumbangan[m.chat] = {
        sender: m.sender,
        message: m,
        count,
        hasil,
        key,
        pesan: conn,
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, { delete: key });
            delete conn.sumbangan[m.chat];
        }, 60 * 1000)
    };
}

handler.before = async m => {
    conn.sumbangan = conn.sumbangan ? conn.sumbangan : {};
    if (m.isBaileys || !(m.chat in conn.sumbangan)) return;
    let { timeout, sender, message, count, hasil, key, pesan } = conn.sumbangan[m.chat];

    if (m.id === message.id) return;

    let user = global.db.data.users[m.sender];
    let _user = global.db.data.users[sender];
    let name = m.pushName || m.name || 'Pengguna';

    if (/(✔️|y(es)?)/g.test(m.text.toLowerCase())) {
        if (m.sender !== sender) {
            if (user.money < count) {
                conn.reply(m.chat, `⚠️ Maaf, uang kamu tidak cukup untuk memberikan sumbangan sebesar *${hasil}*. Uang kamu saat ini: ${formatRupiah(user.money)}`, m);
                pesan.sendMessage(m.chat, { delete: key });
                delete conn.sumbangan[m.chat];
                return;
            }

            user.money -= count;
            _user.money += count;
            conn.reply(m.chat, `✨ Terima kasih!\n${name} telah memberi sumbangan sebesar *${hasil}*`, m);
            pesan.sendMessage(m.chat, { delete: key });
            delete conn.sumbangan[m.chat];

            let fanzFkontak = {
                key: {
                    remoteJid: "status@broadcast",
                    participant: "0@s.whatsapp.net",
                    fromMe: false,
                    id: "",
                },
                message: {
                    conversation: "_The System Notifications Sumbangan User_",
                },
            };
            conn.reply(global.idk, `* *┗ Yuuka NOTIFICATIONS ┓* \n\n✅ *${name} Sukses Memberikan Sumbangan To ${user.name}* \n\n Sebanyak ${count} Money \n\n*Terimakasih Atas Sumbangannya*`, fanzFkontak);
        } else {
            await conn.reply(m.chat, "⚠️ Tidak bisa meminta sumbangan ke diri anda sendiri!.", m);
            pesan.sendMessage(m.chat, { delete: key });
            delete conn.sumbangan[m.chat];
        }
    } else if (/(✖️|n(o)?)/g.test(m.text.toLowerCase())) {
        conn.reply(m.chat, ` ${name}, terima kasih sudah mempertimbangkan!`, m);
        pesan.sendMessage(m.chat, { delete: key });
        delete conn.sumbangan[m.chat];
    }
};

// ... (Kode fungsi formatRupiah dan lainnya tetap sama)

handler.help = ['sumbangan'].map(v => v + ' [jumlah]');
handler.tags = ['rpg'];
handler.command = /^(sumbangan)$/i;
handler.disabled = false;
handler.register = true;

export default handler;

function isNumber(x) {
    return !isNaN(x);
}

function formatRupiah(number) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
    return formatter.format(number);
}