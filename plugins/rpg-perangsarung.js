/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
const handler = async (m, { conn, args }) => {
    global.psarung = global.psarung || {};
    let room = global.psarung[m.chat];

    if (args[0] === "join") {
        if (!room) {
            global.psarung[m.chat] = { players: [] };
            room = global.psarung[m.chat];
        }

        if (room.players.some(p => p.jid === m.sender)) {
            return conn.reply(m.chat, "❌ Kamu sudah bergabung dalam permainan!", m);
        }

        if (room.players.length >= 7) {
            return conn.reply(m.chat, "⚠️ Maksimal 7 pemain telah bergabung!", m);
        }

        room.players.push({ jid: m.sender, name: conn.getName(m.sender) });

        conn.reply(m.chat, `✅ @${m.sender.split("@")[0]} bergabung dalam Perang Sarung!`, m, {
            mentions: [m.sender]
        });

        return;
    }

    if (args[0] === "start") {
        if (!room || room.players.length < 3) {
            return conn.reply(m.chat, "⚠️ Minimal 3 pemain diperlukan untuk memulai!", m);
        }

        let players = [...room.players];

        function randomEliminate(index) {
            if (players.length > 0) {
                let eliminated = players.splice(Math.floor(Math.random() * players.length), 1)[0];
                let penalty = [50, 40, 30, 20][index] || 0;
                let user = global.db.data.users[eliminated.jid] || {};
                user.score = (user.score || 0) - penalty;
                return eliminated;
            }
            return null;
        }

        conn.reply(m.chat, `⚔️ **Perang Sarung Dimulai!** ⚔️\nPeserta:\n${players.map(p => `- @${p.jid.split('@')[0]}`).join('\n')}`, m, { mentions: players.map(p => p.jid) });

        let rounds = [5000, 10000, 15000, 20000];

        rounds.forEach((time, index) => {
            setTimeout(() => {
                let eliminated = randomEliminate(index);
                if (eliminated) {
                    conn.reply(m.chat, `🔥 **Ronde ${index + 1}**: ${eliminated.name} telah mati! ☠️ (-${[50, 40, 30, 20][index]} skor)`, m);
                }
            }, time);
        });

        setTimeout(() => {
            let juara3 = randomEliminate(3);
            let juara2 = randomEliminate(3);
            let juara1 = players.length > 0 ? players[0] : null;

            let resultText = `🏆 **Hasil Akhir Perang Sarung!** 🏆\n\n` +
                (juara1 ? `🥇 **Juara 1:** ${juara1.name} (+50 skor)\n` : "") +
                (juara2 ? `🥈 **Juara 2:** ${juara2.name} (+30 skor)\n` : "") +
                (juara3 ? `🥉 **Juara 3:** ${juara3.name} (+20 skor)\n` : "") +
                `\nTerima kasih sudah bermain!`;

            if (juara1) {
                let user = global.db.data.users[juara1.jid] || {};
                user.score = (user.score || 0) + 50;
            }
            if (juara2) {
                let user = global.db.data.users[juara2.jid] || {};
                user.score = (user.score || 0) + 30;
            }
            if (juara3) {
                let user = global.db.data.users[juara3.jid] || {};
                user.score = (user.score || 0) + 20;
            }

            conn.reply(m.chat, resultText, m);
            delete global.psarung[m.chat];
        }, 30000);
    }
};

handler.help = ["psarung join", "psarung start"];
handler.tags = ["game"];
handler.command = /^psarung$/i;
handler.group = true;
handler.register = true;

export default handler;