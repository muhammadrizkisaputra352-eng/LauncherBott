/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  // Inisialisasi properti money jika belum ada
  if (user.money == null) user.money = 0;

  // Inisialisasi kafe jika belum ada
  if (!user.cafe) {
    user.cafe = {
      name: "Kafe Lezat",
      level: 1,
      capacity: 10,
      stock: 50,      // Stok awal
      maxStock: 50,   // Maksimal stok awal
      customers: 0,
      revenue: 0,
      popularity: 5,
      upgradeCost: 1000000, // Upgrade cost 1.000.000
      menu: [{ item: "Kopi Hitam", price: 30000 }],
      facilities: ["Meja Kayu"],
      openHours: { start: 8, end: 22 },
      rating: 4.2,
    };
  }

  // Fungsi menampilkan status kafe
  const cafeStatus = () => {
    return `
☕ *Status Kafe - ${user.cafe.name}*
📈 Level: ${user.cafe.level}
👥 Kapasitas: ${user.cafe.capacity} pelanggan
📦 Stok Bahan: ${user.cafe.stock} / ${user.cafe.maxStock} unit
✨ Popularitas: ${user.cafe.popularity}%
⭐ Rating: ${user.cafe.rating}/5
Biaya Upgrade Selanjutnya: Rp${user.cafe.upgradeCost.toLocaleString()}

Jam Operasional: ${user.cafe.openHours.start}:00 - ${user.cafe.openHours.end}:00
Menu: ${user.cafe.menu.map(menu => `${menu.item} (Rp${menu.price})`).join(', ') || 'Belum ada menu'}
Fasilitas: ${user.cafe.facilities.join(', ')}

💰 Total Pendapatan Kafe: Rp${user.cafe.revenue.toLocaleString()}
💵 Uang Anda: Rp${user.money.toLocaleString()}
Perintah:
- *${usedPrefix}upgradecafe* - Upgrade kafe (meningkatkan kapasitas, popularitas, & stok maksimum)
- *${usedPrefix}servecustomers* - Layani pelanggan
- *${usedPrefix}addmenu <nama> <harga>* - Tambahkan menu
- *${usedPrefix}buyStock <jumlah>* - Beli bahan baku
- *${usedPrefix}renamecafe <nama baru>* - Ubah nama kafe
- *${usedPrefix}menucafe* - Lihat daftar menu kafe
    `;
  };

  // Fungsi untuk melayani pelanggan
  const serveCustomers = () => {
    if (user.cafe.stock < user.cafe.capacity) {
      return m.reply(`📦 Stok bahan baku tidak mencukupi untuk melayani pelanggan! Silakan beli stok dengan perintah *${usedPrefix}buyStock <jumlah>*`);
    }
    let maxCustomers = Math.min(
      user.cafe.capacity,
      Math.floor(user.cafe.popularity / 10) + Math.floor(Math.random() * 5)
    );
    let totalIncome = 0;
    user.cafe.customers += maxCustomers;
    for (let i = 0; i < maxCustomers; i++) {
      let menuItem = user.cafe.menu[Math.floor(Math.random() * user.cafe.menu.length)];
      let customerSpend = Math.floor(menuItem.price * ((user.cafe.rating / 5) + Math.random() * 0.2));
      totalIncome += customerSpend;
    }
    user.cafe.revenue += totalIncome;
    // Pendapatan ditambahkan ke uang user
    user.money += totalIncome;
    user.cafe.stock -= maxCustomers; // Kurangi stok sesuai pelanggan yang dilayani
    user.cafe.popularity += Math.floor(Math.random() * 3);
    m.reply(`
🍽️ Anda melayani ${maxCustomers} pelanggan hari ini dan memperoleh pendapatan sebesar Rp${totalIncome.toLocaleString()}!
Total pendapatan kafe: Rp${user.cafe.revenue.toLocaleString()}
Sisa stok: ${user.cafe.stock} unit
✨ Popularitas kafe: ${user.cafe.popularity}%
💵 Uang Anda: Rp${user.money.toLocaleString()}
    `);
  };

  // Fungsi upgrade kafe: stok dan stok maksimum akan bertambah (dikalikan dua)
  const upgradeCafe = () => {
    if (user.money < user.cafe.upgradeCost) {
      return m.reply(`💸 Uang Anda tidak cukup untuk upgrade! Diperlukan Rp${user.cafe.upgradeCost.toLocaleString()}.`);
    }
    user.money -= user.cafe.upgradeCost;
    user.cafe.capacity += 10; // Tambah kapasitas pelanggan
    user.cafe.level += 1;
    user.cafe.popularity += 5;
    user.cafe.upgradeCost = Math.floor(user.cafe.upgradeCost * 1.8);
    user.cafe.maxStock *= 2;
    user.cafe.stock *= 2; // Stock bertambah secara berkelipatan
    m.reply(`
☕ *Upgrade Kafe Berhasil!*
Level baru: ${user.cafe.level}
Kapasitas baru: ${user.cafe.capacity} pelanggan
Popularitas kafe: ${user.cafe.popularity}%
Stok maksimum baru: ${user.cafe.maxStock} unit
Stok bahan kini: ${user.cafe.stock} unit
Biaya upgrade selanjutnya: Rp${user.cafe.upgradeCost.toLocaleString()}
Uang Anda tersisa: Rp${user.money.toLocaleString()}
    `);
  };

  // Fungsi untuk membeli stok bahan baku dengan batas maksimum sesuai maxStock
  const buyStock = (amount) => {
    if (user.cafe.stock >= user.cafe.maxStock) {
      return m.reply(`📦 Stok sudah penuh (${user.cafe.maxStock} unit). Tidak dapat membeli lagi.`);
    }
    const maxPurchase = user.cafe.maxStock - user.cafe.stock;
    if (amount > maxPurchase) {
      return m.reply(`Anda hanya dapat membeli maksimal ${maxPurchase} unit untuk mencapai stok maksimum ${user.cafe.maxStock} unit.`);
    }
    const cost = amount * 15000; // Harga per unit adalah 15.000
    if (user.money < cost) {
      return m.reply(`💸 Uang Anda tidak cukup untuk membeli ${amount} unit stok. Diperlukan Rp${cost.toLocaleString()}.`);
    }
    user.money -= cost;
    user.cafe.stock += amount;
    m.reply(`📦 Sukses membeli ${amount} unit stok bahan seharga Rp${cost.toLocaleString()}.\nTotal stok sekarang: ${user.cafe.stock} unit.\nUang Anda tersisa: Rp${user.money.toLocaleString()}`);
  };

  // Fungsi untuk mengganti nama kafe
  const renameCafe = (newName) => {
    if (!newName) return m.reply(`Masukkan nama baru untuk kafe Anda. Contoh: *${usedPrefix}renamecafe Kafe Bahagia*`);
    user.cafe.name = newName;
    m.reply(`📝 Nama kafe berhasil diubah menjadi: *${newName}*`);
  };

  // Fungsi untuk menambah menu baru dengan nama yang bisa mengandung spasi
  // Token terakhir dianggap sebagai harga, sisanya sebagai nama menu
  const addMenu = (text) => {
    let args = text.trim().split(/\s+/);
    if (args.length < 2) {
      return m.reply(`Gunakan perintah: *${usedPrefix}addmenu <nama> <harga>*\nContoh: ${usedPrefix}addmenu Goday Freez 25000`);
    }
    let price = parseInt(args[args.length - 1]);
    if (isNaN(price)) {
      return m.reply(`Harga tidak valid. Gunakan perintah: *${usedPrefix}addmenu <nama> <harga>*\nContoh: ${usedPrefix}addmenu Goday Freez 25000`);
    }
    let item = args.slice(0, -1).join(" ");
    user.cafe.menu.push({ item, price });
    let menuList = user.cafe.menu.map(menu => `${menu.item} (Rp${menu.price})`).join(', ');
    m.reply(`☕ Menu baru ditambahkan: ${item} dengan harga Rp${price}.\n\n*Menu Kafe Saat Ini:* ${menuList}`);
  };

  // Fungsi untuk menampilkan daftar menu (menucafe atau cafemenu)
  const showMenuCafe = () => {
    if (user.cafe.menu.length === 0) {
      return m.reply("Belum ada menu di kafe Anda.");
    }
    let menuList = user.cafe.menu.map((menu, idx) => `${idx + 1}. ${menu.item} (Rp${menu.price})`).join('\n');
    m.reply(`*Menu Kafe Saat Ini:*\n${menuList}`);
  };

  // Standarkan command ke lowercase agar switch-case berfungsi dengan benar
  let cmd = command.toLowerCase();

  // Menangani perintah berdasarkan command yang dikirim
  switch (cmd) {
    case 'cafe':
      m.reply(cafeStatus());
      break;

    case 'upgradecafe':
      upgradeCafe();
      break;

    case 'servecustomers':
      serveCustomers();
      break;

    case 'buystock':
      {
        const amount = parseInt(text);
        if (isNaN(amount) || amount <= 0)
          return m.reply(`Gunakan perintah: *${usedPrefix}buyStock <jumlah>*`);
        buyStock(amount);
      }
      break;

    case 'renamecafe':
      renameCafe(text.trim());
      break;

    case 'addmenu':
      addMenu(text);
      break;

    case 'menucafe':
    case 'cafemenu':
      showMenuCafe();
      break;

    default:
      m.reply(`Perintah tidak dikenal. Gunakan *${usedPrefix}cafe* untuk melihat status kafe.`);
      break;
  }
};

handler.help = ['cafe', 'upgradecafe', 'servecustomers', 'buyStock', 'addmenu', 'renamecafe', 'menucafe'];
handler.tags = ['rpg'];
handler.command = /^(cafe|upgradecafe|servecustomers|buyStock|addmenu|renamecafe|menucafe|cafemenu)$/i;

handler.register = true;
handler.limit = true;

export default handler;