/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (!user.cheatTime) user.cheatTime = 0;
    if (new Date() - user.cheatTime < 60000) throw `Tunggu setelah ${await time(user.cheatTime + 60000 - new Date())}`;

    let coinValue = 10000000;
    let limitValue = 10000000;
    let expValue = 10000000;

    global.db.data.users[m.sender].money = coinValue;
    global.db.data.users[m.sender].limit = limitValue;
    global.db.data.users[m.sender].exp = expValue;

    user.cheatTime = new Date() * 1;

    m.reply(`[ *P R E M I U M* 🔥 ]\n\n*Selamat Kamu Mendapatkan*:\n*Koin:* ${coinValue}\n*Limit:* ${limitValue}\n*Exp:* ${expValue}`);
}

handler.command = /^(cheat)$/i;
handler.premium = true;

export default handler;

function time(ms) {
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return `${m.toString().padStart(2, '0')} *Menit* ${s.toString().padStart(2, '0')} *Detik*`;
}