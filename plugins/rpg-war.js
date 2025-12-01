let handler = async (m, { conn, usedPrefix, args, command }) => {
    conn.war = conn.war || {};
    conn.war2 = conn.war2 || {};

    const warRoom = conn.war[m.chat] || (conn.war[m.chat] = {});
    const warData = conn.war2[m.chat] || (conn.war2[m.chat] = { war: false, turn: 0, time: 0, money: 0 });

    if (!args[0] || args[0] === 'help') return m.reply(`*❏  W A R - Z O N E*

[1] War Zone adalah game perang dengan sistem _turn attack_
[2] Bisa dimainkan dari 1v1 sampai 5v5
[3] Modal perang adalah harta rampasan yang bisa dimenangkan
[4] Setiap pemain akan mendapatkan 5000 HP
[5] Keberhasilan menyerang tergantung level vs level
[6] Kesempatan menyerang 40 detik, lewat itu dianggap AFK (HP -2500)
[7] Tim menang jika semua lawan kalah (HP <= 0)

*❏  C O M M A N D S*
*${usedPrefix + command} join A/B* = Bergabung dalam game
*${usedPrefix + command} left* = Keluar dari game
*${usedPrefix + command} money 10xx* = Atur taruhan
*${usedPrefix + command} player* = Lihat pemain
*${usedPrefix + command} start* = Mulai game`);

    switch (args[0].toLowerCase()) {
        case 'money':
            if (!warRoom) return m.reply('*Silahkan buat room terlebih dahulu (Ketik .war join)*');
            if (m.sender !== warRoom[0].user) {
                return conn.reply(m.chat, `*Hanya @${warRoom[0].user.split('@')[0]} yang dapat mengubah modal awal perang*`, m, { contextInfo: { mentionedJid: [warRoom[0].user] } });
            }
            const betAmount = parseInt(args[1]);
            if (isNaN(betAmount) || betAmount < 1000000) return m.reply('*Minimal Rp. 1.000.000*');
            warData.money = betAmount;
            return m.reply(`*Berhasil menetapkan modal perang sebesar Rp. ${betAmount.toLocaleString()}*`);

        case 'join':
            if (global.db.data.users[m.sender].money < 10000) return m.reply('*Uang kamu minimal Rp. 10.000 untuk bermain game ini.*');
            if (!warRoom) {
                warRoom[0] = { user: m.sender, hp: 5000, lvl: global.db.data.users[m.sender].level, turn: false };
                for (let i = 1; i < 10; i++) warRoom[i] = { user: '', hp: 0, lvl: 0, turn: false };
                return m.reply('*Berhasil masuk ke dalam game sebagai Team A*\n\n*.war join a/b* = Bergabung dalam game\n*.war start* = Mulai game');
            }
            if (warData.war) return m.reply('*Permainan sudah dimulai, tidak bisa join.*');
            if (Object.values(warRoom).some(p => p.user === m.sender)) return m.reply('*Anda sudah masuk ke dalam game*\n\n*.war join a/b* = Bergabung dalam game\n*.war start* = Mulai game');

            const team = args[1]?.toLowerCase();
            const teamIndex = team === 'a' ? 1 : team === 'b' ? 6 : null;
            if (!team || !['a', 'b'].includes(team)) return m.reply('*Pilih salah satu tim A atau B*\n\n.war join A\n.war join B');
            if (warData.money === 0) return conn.reply(m.chat, `*Tolong @${warRoom[0].user.split('@')[0]} tetapkan modal awal perang (minimal Rp. 1.000.000)*\n\n.war money 1000000`, m, { contextInfo: { mentionedJid: [warRoom[0].user] } });
            if (global.db.data.users[m.sender].money < warData.money) return m.reply(`*Uang kamu minimal Rp. ${warData.money.toLocaleString()} untuk bermain game ini.*`);

            const availableSlot = Object.values(warRoom).slice(teamIndex, teamIndex + 5).findIndex(p => !p.user);
            if (availableSlot === -1) return m.reply(`Team ${team.toUpperCase()} sudah penuh`);
            warRoom[teamIndex + availableSlot] = { user: m.sender, hp: 5000, lvl: global.db.data.users[m.sender].level, turn: false };
            return m.reply(`*Berhasil masuk ke dalam game sebagai Team ${team.toUpperCase()}*\n\n*.war join a/b* = Bergabung dalam game\n*.war start* = Mulai game`);


        case 'left':
            if (!warData) return m.reply('*Kamu tidak sedang berada di dalam game*');
            if (warData.war) return m.reply('*Perang sudah dimulai, anda tidak bisa keluar*');
            const playerIndex = Object.values(warRoom).findIndex(p => p.user === m.sender);
            if (playerIndex === -1) return m.reply('*Kamu tidak sedang berada di dalam game*');
            warRoom[playerIndex].user = '';
            return m.reply('*Berhasil keluar dari game*');


        case 'player':
            if (!warRoom) return m.reply('*Tidak ada pemain yang join room War Zone*');
            const teamA = Object.values(warRoom).slice(0, 5).filter(p => p.user).map(p => ({ user: p.user, hp: p.hp, lvl: p.lvl }));
            const teamB = Object.values(warRoom).slice(5, 10).filter(p => p.user).map(p => ({ user: p.user, hp: p.hp, lvl: p.lvl }));
            const mentionedJid = [...teamA, ...teamB].map(p => p.user);

            const playerStats = `${warData.war ? `*Giliran : @${warRoom[warData.turn].user.split('@')[0]}*\n*Taruhan : Rp. ${warData.money.toLocaleString()}*\n\n` : `*Taruhan : Rp. ${warData.money.toLocaleString()}*\n\n`}*TEAM A :*\n${teamA.map((p, i) => `${p.hp > 0 ? '❤️ ' : '☠️ '}@${p.user.split('@')[0]} (Lv.${p.lvl} HP: ${p.hp})`).join('\n')}\n\n*TEAM B :*\n${teamB.map((p, i) => `${p.hp > 0 ? '❤️ ' : '☠️ '}@${p.user.split('@')[0]} (Lv.${p.lvl} HP: ${p.hp})`).join('\n')}`;

            return conn.reply(m.chat, playerStats, m, { contextInfo: { mentionedJid } });


        case 'start':
            if (!warData) return m.reply('*Room belum dibuat!*');
            if (warData.war) return m.reply('*Perang sudah dimulai, tidak bisa join.*');
            const teamACount = Object.values(warRoom).slice(0, 5).filter(p => p.user).length;
            const teamBCount = Object.values(warRoom).slice(5, 10).filter(p => p.user).length;
            if (teamACount === teamBCount && teamACount > 0) {
                warData.war = true;
                const firstPlayer = warRoom[0].user;
                return conn.reply(m.chat, `*Permainan berhasil dimulai*\n*Giliran @${firstPlayer.split('@')[0]} untuk menyerang*\n\n.war player = Statistik pemain\n.attack @tag = Serang lawan`, m, { contextInfo: { mentionedJid: [firstPlayer] } });
            } else {
                return m.reply(`Jumlah pemain tidak seimbang. Team A: ${teamACount}, Team B: ${teamBCount}`);
            }
        default:
            throw 'Join Dulu';
    }
};

handler.help = ['war'];
handler.tags = ['rpg'];
handler.command = /^(war)$/i;
handler.group = true;

export default handler;