import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const handler = async (m, { conn }) => {
  const dir = process.cwd();
  const files = [];
  const results = [];

  function readDirRecursive(folder) {
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(folder, entry.name);
      if (entry.isDirectory()) readDirRecursive(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
    }
  }

  readDirRecursive(dir);

  let okCount = 0;
  for (const file of files) {
    try {
      await new Promise((resolve, reject) => {
        exec(`node --check "${file}"`, (error, stdout, stderr) => {
          if (error) reject(stderr || error.message);
          else resolve(stdout);
        });
      });
      okCount++;
    } catch (err) {
      results.push({ file: path.relative(dir, file), error: err.toString().trim() });
    }
  }

  let msg = '📂 *Hasil Cek Error*\n\n';
  results.forEach(r => {
    msg += `❌ ERROR: ${r.file}\n   ↳ ${r.error.split('\n')[0]}\n\n`;
  });
  msg += `📊 Total file dicek: ${files.length}\n✅ OK: ${okCount}\n❌ Error: ${results.length}`;

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.help = ['checkerror'];
handler.tags = ['owner'];
handler.command = /^(checkerror)$/i;
handler.owner = true;
handler.premium = false;
handler.limit = false;

export default handler;