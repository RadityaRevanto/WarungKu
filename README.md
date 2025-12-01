# WarungKu — Offline-First POS untuk Warung dan Toko Kecil

WarungKu adalah aplikasi POS (Point of Sale) modern yang dirancang untuk membantu warung kecil mengelola produk, transaksi, dan stok secara efisien. Aplikasi ini mendukung konsep **offline-first**, sehingga tetap dapat digunakan meskipun tanpa koneksi internet.

---

## Problem Statement

Banyak warung atau toko kecil masih mengandalkan:

* Catatan manual
* Kalkulator
* Perhitungan omzet yang tidak tercatat rapi

Akibatnya:

* Sulit memantau stok
* Sulit melihat omzet harian atau mingguan
* Tingkat kesalahan pencatatan tinggi
* Tidak tersedia laporan otomatis

WarungKu hadir untuk memberikan solusi terhadap permasalahan tersebut.

---

## Core Features

### 1. Product Catalog

Fitur CRUD produk meliputi:

* Nama produk
* Harga
* Stok
* Barcode (opsional)
* Minimal stok (untuk peringatan)

### 2. Transaction System

* Input penjualan dengan memilih produk
* Pengaturan jumlah pembelian
* Perhitungan total otomatis
* Penyimpanan transaksi ke database
* Mendukung transaksi secara offline

### 3. Sales Summary

* Ringkasan omzet harian dan mingguan
* Visualisasi penjualan dalam bentuk grafik sederhana

### 4. Stock Alert

* Notifikasi stok menipis berdasarkan batas minimal stok
* Membantu pemilik warung melakukan restock tepat waktu

---

## Fitur Unggulan (Wow Factor)

### Barcode Scanner

* Pencarian cepat melalui barcode atau kata kunci

### Print Receipt

* Generate struk dalam format PDF

### Offline-First

Aplikasi tetap dapat digunakan tanpa internet:

* Transaksi offline disimpan ke IndexedDB
* Sistem melakukan sinkronisasi otomatis saat online
* Tidak ada transaksi yang hilang

---

## Teknologi Utama (opsional, dapat disesuaikan)

* Next.js
* Supabase (Database dan Auth)
* IndexedDB (Offline Queue)
* Prisma ORM
* ShadCN UI
* TailwindCSS

---

## Lisensi

Proyek bebas digunakan untuk keperluan pembelajaran maupun pengembangan.

---

## Kontribusi

Kontribusi sangat terbuka.
Prosedur: Fork → Pull Request → Review → Merge.

---

## Install dan Setup

Ikuti langkah berikut untuk menjalankan WarungKu secara lokal.

---

### 1. Clone Repository

```bash
git clone https://github.com/username/warungku.git
cd warungku
```

---

### 2. Install Dependencies

Menggunakan npm:

```bash
npm install
```

Atau menggunakan pnpm:

```bash
pnpm install
```

---

### 3. Setup Environment Variables

Salin file template ENV:

```bash
cp .env.example .env.local
```

Isi variabel berikut:

```
DATABASE_URL=" "
DIRECT_URL=" "

NEXT_PUBLIC_SUPABASE_URL=" "
NEXT_PUBLIC_SUPABASE_ANON_KEY=" "

BETTER_AUTH_SECRET=" "
BETTER_AUTH_URL="http://localhost:3000"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Tambahkan variabel lain jika diperlukan.

---

### 4. Setup Database

Jalankan migration Prisma:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Jika menggunakan Supabase, pastikan tabel sudah sesuai schema.

---

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan pada:

```
http://localhost:3000
```

---

### 6. Build untuk Production

```bash
npm run build
npm start
```

---

### 7. Offline-First (IndexedDB)

IndexedDB aktif secara otomatis pada browser modern.

Jika ingin reset manual:

* Buka DevTools → Application → IndexedDB
* Pilih database `WarungKuOfflineDB`
* Hapus object store jika diperlukan

---

### 8. Testing (Opsional)

```bash
npm run test
```

---

### Selesai

WarungKu siap digunakan secara online maupun offline.

Jika ingin dijadikan README.md siap publish di GitHub, beri tahu saya.
