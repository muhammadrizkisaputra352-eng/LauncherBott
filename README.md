
<p align="center">
  <strong>LauncherBot</strong> adalah bot WhatsApp ringan yang dibangun menggunakan <strong><a href="https://github.com/WhiskeySockets/Baileys">Baileys</a></strong> untuk mendukung fungsionalitas Multi-Device. Bot ini dirancang agar mudah digunakan dan dikembangkan lebih lanjut.
</p>

## 📝 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🚀 Instalasi & Penggunaan](#-instalasi--penggunaan)
- [💡 Contoh Penggunaan](#-contoh-penggunaan)
- [🔧 Konfigurasi](#-konfigurasi)
- [📂 Struktur Proyek](#-struktur-proyek)
- [🤝 Kontribusi](#-kontribusi)

## ✨ Fitur Utama

Bot ini dilengkapi dengan berbagai fitur yang terorganisir dalam plugin.

| Kategori           | Deskripsi                                                              |
| ------------------ | ---------------------------------------------------------------------- |
| **AI**             | Terintegrasi dengan GPT, Deepseek, dan Kimi untuk percakapan cerdas.   |
| **Downloader**     | Unduh media dari Instagram, TikTok, YouTube (MP3/MP4), MediaFire, dll. |
| **Hiburan**        | Perintah seru seperti `cekkhodam`, `truth`, `dare`, dan game lainnya.  |
| **Manajemen Grup** | Alat untuk admin seperti `hidetag`, `totag`, dan pengaturan grup.      |
| **Utilitas**       | Buat stiker, QR code, tingkatkan kualitas gambar (`hd`), dan lainnya.  |
| **Sistem XP**      | Sistem registrasi, level-up, dan cek XP untuk pengguna.                |
| **Owner**          | Perintah khusus untuk pemilik bot (ban, premium, dll).                 |

## 💡 Contoh Penggunaan

Berikut adalah beberapa contoh cara menggunakan perintah bot:

- **Membuat stiker dari gambar yang Anda kirim:**

    > Kirim gambar dengan caption `.sticker`

- **Mengunduh video TikTok:**

    > `.tiktok https://www.tiktok.com/@username/video/12345`

- **Menggunakan AI (GPT):**

    > `.gpt Siapakah penemu bola lampu?`

- **Mencari tahu khodam Anda (untuk hiburan):**
    > `.cekkhodam`

## 🚀 Instalasi & Penggunaan

Untuk memulai, pastikan Anda memiliki **Node.js v18.x** atau lebih tinggi.

1.  **Clone repository ini:**

    ```bash
    git clone https://github.com/AgusXzz/ChiiMD.git
    cd ChiiMD
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Jalankan bot:**
    ```bash
    npm start
    ```
    Masukkan pairing code yang muncul di terminal menggunakan WhatsApp Anda untuk menghubungkan bot.

## 🔧 Konfigurasi

Anda dapat menyesuaikan konfigurasi bot, seperti nomor owner dan pengaturan lainnya, di dalam file `config.js`.

## 📂 Struktur Proyek

```
.
├── plugins/      # Folder utama untuk semua fitur bot
├── lib/          # Library pendukung
├── media/        # Aset media statis
├── config.js     # File konfigurasi utama
├── index.js      # File entri utama
├── main.js       #strat pada bot
└── package.json  # Dependensi dan skrip proyek
```

## 🤝 Kontribusi

Kontribusi kecil diterima (fix bug, perbaikan dokumentasi, penambahan fitur, dll). Langkah:

1. Fork repository
2. Buat branch: git checkout -b feat/nama-fitur
3. Commit & push
4. Buka Pull Request

Untuk perubahan fitur besar, buka issue dulu supaya dibahas.

---

<p align="center">
  <em>Dibuat dengan ❤️ oleh <a href="https://github.com/muhammadrizkisaputra352-eng">Zenn-offc</a></em>
</p>

