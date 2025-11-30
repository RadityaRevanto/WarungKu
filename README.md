# 🏪 WarungKu — Offline-First POS untuk Warung & Toko Kecil

WarungKu adalah aplikasi POS (Point of Sale) modern yang dirancang untuk membantu warung kecil mengelola produk, transaksi, dan stok secara lebih efisien. Aplikasi ini mendukung **offline-first**, sehingga tetap bisa digunakan meski tanpa internet.

---

## 📌 Problem Statement

Banyak warung/toko kecil masih mengandalkan:

* Catatan manual,
* Kalkulator,
* Perhitungan omzet yang tidak terdata rapi.

Akibatnya:

* Sulit memantau stok,
* Sulit melihat omzet harian/mingguan,
* Human error tinggi,
* Tidak ada laporan otomatis.

WarungKu hadir untuk menyelesaikan masalah tersebut.

---

## 🚀 Core Features

### 📦 1. Product Catalog

CRUD produk:

* Nama produk
* Harga
* Stok
* Barcode (opsional)
* Minimal stok (untuk alert)

### 💸 2. Transaction System

* Input penjualan dengan memilih produk
* Quantity
* Auto-calculate total
* Simpan transaksi ke database
* Mendukung transaksi offline

### 📊 3. Sales Summary

* Ringkasan omzet harian & mingguan
* Tampilkan simple chart untuk visualisasi penjualan

### ⚠️ 4. Stock Alert

* Notifikasi stok menipis berdasarkan minimal stok
* Membantu pemilik warung melakukan restock tepat waktu

---

## ✨ “Wow Factor” — Fitur Pembeda

### 📷 Barcode Scanner

* Web: Quick search menggunakan barcode/keyword

### 🧾 Print Receipt

* Web → generate PDF struk otomatis

### 🔌 Offline-First (Super Penting!)

Aplikasi tetap bisa dipakai untuk transaksi meski **tidak ada internet**:

* Semua transaksi offline akan disimpan di IndexedDB
* Saat online, sistem akan melakukan auto-sync
* Tidak ada transaksi hilang

---

## 🛠️ Teknologi Utama (opsional, edit sesuai project-mu)

* Next.js
* Supabase (Database + Auth)
* IndexedDB (Offline Queue)
* Prisma ORM
* ShadCN UI
* TailwindCSS

---

## 📎 Lisensi

Project bebas digunakan untuk kebutuhan pembelajaran dan pengembangan.

---

## 💬 Kontribusi

Kontribusi dipersilakan!
Fork → Pull Request → Review → Merge.

---

## 🛠️ Install & Setup

Ikuti langkah berikut untuk menjalankan WarungKu secara lokal.

---

### 🔧 **1. Clone Repository**

```bash
git clone https://github.com/username/warungku.git
cd warungku
```

---

### 📦 **2. Install Dependencies**

Menggunakan npm:

```bash
npm install
```

Atau menggunakan pnpm:

```bash
pnpm install
```

---

### 🔐 **3. Setup Environment Variables**

Copy file env template:

```bash
cp .env.example .env.local
```

Isi variabel berikut (sesuaikan dengan project-mu):

```
DATABASE_URL=" "
DIRECT_URL=" "

NEXT_PUBLIC_SUPABASE_URL=" "
NEXT_PUBLIC_SUPABASE_ANON_KEY=" "

BETTER_AUTH_SECRET=" "
BETTER_AUTH_URL="http://localhost:3000"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Tambahkan jika memakai auth atau storage.

---

### 🗄️ **4. Setup Database**

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

### 🚀 **5. Jalankan Development Server**

```bash
npm run dev
```

Aplikasi akan berjalan pada:

```
http://localhost:3000
```

---

### 🌐 **6. Build untuk Production**

```bash
npm run build
npm start
```

---

### 📱 **7. Enable Offline-First (IndexedDB)**

Tidak perlu konfigurasi tambahan.
IndexedDB otomatis aktif ketika user membuka aplikasi di browser modern.

Jika ingin reset manual:

* Buka **DevTools → Application → IndexedDB**
* Pilih database `WarungKuOfflineDB`
* Hapus object store jika perlu

---

### 🧪 **8. Testing (Opsional)**

```bash
npm run test
```

---

### 🎉 Selesai!

WarungKu siap digunakan—online atau offline.