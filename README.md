# 📊 SIKAP - Sistem Informasi Kinerja & Penyerapan Anggaran
> **Kantor Wilayah Kementerian Imigrasi dan Pemasyarakatan Bangka Belitung (DIPA TA 2026)**

---

## 📌 1. Penjelasan untuk Orang Awam (Non-Technical Summary)

### Apa itu SIKAP?
**SIKAP** adalah aplikasi dashboard monitoring anggaran berbasis web yang dirancang khusus untuk memantau **alokasi Pagu Anggaran**, **Realisasi Penyerapan**, dan **Sisa Anggaran** secara *real-time* dan transparan di lingkungan Kanwil Imigrasi Babel.

### Mengapa SIKAP Dibutuhkan?
Sebelum ada SIKAP, proses pelaporan anggaran dilakukan secara manual dengan merekap file spreadsheet secara berkala. Dengan SIKAP:
* 🚀 **Otomatis & Real-Time**: Setiap kali staf mengedit data di Google Sheets, grafik dan angka di website akan **otomatis diperbarui** tanpa perlu membuat laporan ulang.
* 🎯 **Pantau Target Anggaran**: Pimpinan dan penanggung jawab bidang dapat melihat apakah penyerapan anggaran sudah memenuhi target triwulanan (misal: **Target 70% di Q3**).
* 💡 **Deteksi Dini Rencana Output (RO)**: Membantu mengidentifikasi kegiatan/RO mana yang penyerapan anggarannya masih rendah (**Perlu Dorongan**), optimal, atau sangat baik.

---

## 🛠️ 2. Penjelasan untuk Pengembang (Developer Technical Architecture)

### 🏗️ Arsitektur & Teknologi Utama
Aplikasi ini dibangun menggunakan arsitektur **Single-Page Application (SPA)** berbasis CDN modern tanpa memerlukan langkah kompilasi (*build step*) yang rumit.

* **Frontend Framework**: [React 18](https://react.dev/) via Unpkg CDN & Babel Standalone (`text/babel`).
* **UI & Styling**: [Tailwind CSS CDN](https://tailwindcss.com/) dengan palet warna khusus Kementerian (Navy `#002147`, Gold `#D4AF37`, Cyan `#00A896`, Slate).
* **Data Visualization**: [Chart.js (v4)](https://www.chartjs.org/) untuk visualisasi Doughnut Chart, Horizontal Bar Chart, dan Grouped Bar Chart.
* **Iconography**: [Lucide Icons](https://lucide.dev/).
* **Backend Dev Server**: Lightweight Python HTTP Server (`server.py`).

---

### 🔄 Alur Data & Sinkronisasi (Dual-Mode Data Engine)

```text
[ Google Sheets Database ]
          │
          ├──> 1. Google Sheets API v4 (JSON Endpoint) ──┐
          │                                              ├──> [ Parser & Formatter ] ──> [ React State ] ──> [ Dashboard & Chart.js ]
          └──> 2. Direct Live CSV Export (Fallback) ─────┘
```

1. **Dual-Mode Fetching & Failover (Toleransi Kesalahan)**:
   * **Mode Utama (API v4)**: Mengakses `https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/Sheet1?key={GOOGLE_API_KEY}`.
   * **Mode Fallback (CSV Live)**: Jika API Key tidak ada atau error (403/400), sistem otomatis beralih menggunakan `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv`.
2. **Anti-Browser Caching**:
   * Setiap request menyertakan query parameter timestamp acak (`&_t=Date.now()`) untuk memastikan browser selalu mengambil data paling segar dari Google Sheets.
3. **Data Parsing & Formatting**:
   * `parseAmount()`: Membersihkan string angka bercorak Rupiah (misal: `Rp 8.008.000,00` -> `8008000.00`).
   * `parsePercentage()`: Menghitung ulang persentase secara matematis jika kolom persentase di sheet tidak valid.
4. **Periodic Auto-Sync**:
   * Sinkronisasi otomatis berjalan setiap **10 detik** (`setInterval`).

---

## 📂 3. Struktur Berkas Proyek

```text
SIKAP/
├── index.html              # Aplikasi utama (React + Tailwind + Chart.js dalam 1 file)
├── server.py                # Server HTTP lokal berbasis Python (Port 8081)
├── n8n_workflow_sikap.json  # Konfigurasi otomasi n8n workflow (opsional/integrasi)
├── SikapDashboard.jsx      # File komposer UI mentah / referensi komponen React
└── README.md               # Dokumentasi proyek ini
```

---

## 🖥️ 4. Panduan Jalankan Aplikasi (Quick Start)

### Prasyarat
* Python 3.x terinstal di komputer Anda.

### Langkah-Langkah:
1. **Jalankan Server Lokal**:
   Buka terminal/PowerShell di direktori proyek dan jalankan:
   ```bash
   python server.py
   ```
2. **Akses Dashboard**:
   Buka browser web (Chrome, Edge, Firefox) dan akses:
   👉 **`http://localhost:8081`**

---

## 🎨 5. Modul & Tampilan Utama Dashboard

### 1. Dashboard Utama
* **3 Key Metric Cards**: Total Pagu Anggaran (DIPA 2026), Total Realisasi (dengan % Capaian), dan Sisa Pagu Anggaran.
* **Gauge Circular Chart**: Visualisasi total penyerapan anggaran Kanwil Imigrasi Babel.
* **Capaian per Bidang**:
  1. *Bagian Tata Usaha dan Umum (BAG-TUM)*
  2. *Dokumen Perjalanan, Izin Tinggal & Status Keimigrasian (DOKLAN)*
  3. *Penegakan Hukum dan Kepatuhan Internal (GAKKUM)*
* **Tabel Detail RO**: Menampilkan daftar Rencana Output per bidang lengkap dengan kode, pagu, realisasi, progress bar, dan lencana status.

### 2. Analisis RO (Detail Chart.js View)
* **Ranking Performa RO (Horizontal Bar Chart)**: Peringkat capaian realisasi 12 RO teratas dengan warna dinamis (Hijau, Kuning, Merah).
* **Distribusi Status RO (Doughnut Chart)**: Proporsi kategori Sangat Baik (≥80%), Optimal (50-79%), dan Perlu Dorongan (<50%).
* **Top 5 Pagu vs Realisasi (Grouped Bar Chart)**: Perbandingan alokasi dana vs realisasi untuk kegiatan dengan alokasi anggaran terbesar.
* **Filter & Search Bar**: Pencarian instan per Kode/Nama RO & penyaringan per Bidang Kerja.

---

*Dokumentasi ini dibuat sebagai acuan teknis dan operasional Sistem SIKAP Kanwil Imigrasi Babel.*
