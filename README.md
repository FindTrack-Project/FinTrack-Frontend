# FinTrack-Frontend

**FinTrack-Frontend** adalah aplikasi web yang dirancang untuk membantu Anda mengelola keuangan pribadi dengan efisien. Aplikasi ini dibangun menggunakan **React** dan **Vite**, menawarkan antarmuka yang responsif dan mudah digunakan.

## ✨ Fitur

Aplikasi ini dilengkapi dengan berbagai fitur inti untuk pengelolaan keuangan:

- **Autentikasi Pengguna**: Sistem login dan register yang aman untuk mengelola akun Anda.
- **Dashboard Keuangan**: Ikhtisar komprehensif tentang kondisi keuangan Anda.
- **Manajemen Dompet (Pockets)**: Kelola berbagai sumber dana atau kategori pengeluaran Anda.
- **Rekomendasi Keuangan**: Saran personal untuk membantu Anda membuat keputusan keuangan yang lebih baik.
- **Tabungan (Savings)**: Lacak dan kelola tujuan tabungan Anda.
- **Pengaturan Akun**: Sesuaikan preferensi dan informasi akun Anda.
- **Riwayat Transaksi**: Lihat semua transaksi Anda untuk pelacakan yang mudah.

## 🗂️ Struktur Direktori

Struktur direktori utama proyek untuk memudahkan navigasi:

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── assets/
├── config/
│   └── apiConfig.js
├── pages/
│   └── Auth/
│       ├── login.jsx
│       └── register.jsx
├── components/
│   ├── Dashboard/
│   ├── Pockets/
│   ├── Recomendation/
│   ├── Savings/
│   ├── Settings/
│   ├── Sidebar/
│   └── transaction/
public/
├── manifest.json
├── pwa-192.png
└── pwa-512.png
```

## ⚙️ Instalasi

Untuk menjalankan proyek secara lokal:

1. **Clone repositori:**

    ```bash
    git clone https://github.com/username/fintrack-frontend.git
    cd fintrack-frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Jalankan aplikasi:**

    ```bash
    npm run dev
    ```

4. **Buka di browser:**  
   Aplikasi akan berjalan di `http://localhost:5173`

## 🔧 Konfigurasi

Pastikan untuk mengkonfigurasi endpoint API Anda.

Ubah konfigurasi API di file berikut:

```bash
src/config/apiConfig.js
```

## 🚀 Build

Untuk membangun aplikasi siap production:

```bash
npm run build
```

Hasil build akan tersedia di direktori `dist/`.

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.  
Lihat file `LICENSE` untuk detail lebih lanjut.

## 🙏 Ucapan Terima Kasih

Proyek ini dibuat khusus untuk keperluan **Capstone FinTrack**.
