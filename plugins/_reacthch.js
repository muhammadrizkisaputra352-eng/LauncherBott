let handler = async (m, { conn, text }) => {
  if (!text) throw "Masukkan link channel + teks.\nContoh:\n.reactch https://whatsapp.com/channel/abc123/456 aku sayang kamu";
  const regex = /https:\/\/whatsapp\.com\/channel\/(\w+)(?:\/(\d+))?/;
  const match = text.match(regex);
  if (!match) throw "URL tidak valid. Format seharusnya: https://whatsapp.com/channel/ID/IDPesan";
  const channelId = match[1];
  const chatId = match[2];
  if (!chatId) throw "ID pesan tidak ditemukan dalam URL.";
  const afterUrlText = text.replace(regex, '').trim();
  const emojiText = emojiFontFormatted(afterUrlText || 'HI');
  try {
    const data = await conn.newsletterMetadata("invite", channelId);
    if (!data) throw "Gagal mengambil metadata channel.";
    await conn.newsletterReactMessage(data.id, chatId, emojiText);
    m.reply(`Sukses kirim reaksi:\n${emojiText}`);
  } catch (err) {
    console.error(err);
    m.reply("Terjadi kesalahan saat mengirim reaksi.");
  }
};
const emojiFontFormatted = (text) => {
  const separator = '🅭';
  return text.split(' ').map(word => emojiFont(word)).join(separator);
};
const emojiFont = (text) => {
  const map = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖', h: '🅗',
    i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝', o: '🅞', p: '🅟',
    q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤', v: '🅥', w: '🅦', x: '🅧',
    y: '🅨', z: '🅩',
    A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗',
    I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟',
    Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧',
    Y: '🅨', Z: '🅩',
    ' ': ' '
  };
  return [...text].map(c => map[c] || c).join('');
};
handler.help = ['reactch <link channel> <teks>'];
handler.tags = ['tool'];
handler.command = /^reactch$/i;
export default handler;