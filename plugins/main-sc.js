import fs from 'fs' 

let handler = async (m, { conn }) => {
let loadd = [


 ]

let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

for (let i = 0; i < loadd.length; i++) {
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })}
	let pfft = `*🛒 Sell Script Bot Launcher Md*

\`🧾Features On Bot\`
*Features Ai*
* Ai GPT
* Ai Openai
* AI Character
* Ai Gemini (Support Image)
* DLL
*Fitur lain-lain*
* Tiktok downloader
* Ig downloader
* Fb downloader
* Brat/bratvid
\`🧾 Info Script\`
*Script Baileys*
* Type Plugins
* Module ESM (@whiskeysockets/baileys)
* No Enc All

\`🏷️ Price List\`
* Price *Rp.7k.000*
* Garansi 15 Days
*  No Update!!

* Price *Rp.10k.000*
* Garansi 2 Bulan
* Free ApiKey
* Free Update

\`You can try it here:\`
*Minat? Chat Owner*
* WhatsApp Owner:+6285783491057
`;
conn.sendMessage(m.chat, {
      text: pfft,
      contextInfo: {
      externalAdReply: {
      title: `© Zen OFFC 2025-2026`,
      body: global.author,
      thumbnailUrl: `https://telegra.ph/file/2281e6c7cc487d443cf99-c1d790e40978784141.jpg`,
      sourceUrl: `https://chat.whatsapp.com/LHa283pnsWNJ2xReTIcapW`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
}
handler.help = ['sc']
handler.tags = ['info']
handler.command = /^(sc|script)$/i;
handler.register = true
handler.private = false
export default handler;