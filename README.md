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
* 💡 **Highlight Sisa Anggaran**: Menyorot total dana yang belum terserap dengan tampilan menonjol agar menjadi prioritas pengawasan.
* 🖨️ **Cetak Laporan PDF Kustom**: Pimpinan dapat memilih secara spesifik grafik (chart) dan modul data mana saja dari setiap menu yang ingin diikutsertakan ke dalam laporan cetak resmi.

---

## 🛠️ 2. Fitur-Fitur Utama Aplikasi (Terbaru & Up-to-Date)

### 🏬 1. Tiga Bidang Kerja Utama Kanwil
1. **BagTUM** — Bagian Tata Usaha dan Umum (`BAG-TUM`)
2. **Doklan** — Bidang Dokumen Perjalanan, Izin Tinggal & Status Keimigrasian (`BID-DOKLAN`)
3. **Gakkum** — Bidang Penegakan Hukum dan Kepatuhan Internal (`BID-GAKKUM`)

### 📋 2. Menu Dashboard Utama
* **3 Key Metric Cards**: Total Pagu Anggaran (DIPA 2026), Total Realisasi (dengan % Capaian), dan Sisa Pagu Anggaran.
* **Gauge Circular Chart**: Visualisasi total penyerapan anggaran Kanwil Imigrasi Babel.
* **Capaian per Bidang**: Tampilan kartu interaktif untuk BagTUM, Doklan, dan Gakkum.
* **Tabel Detail RO**: Menampilkan daftar Rencana Output per bidang lengkap dengan kode, pagu, realisasi, progress bar, dan lencana status.

### 📄 3. Menu Laporan Anggaran (Highlight & Rekapitulasi)
* **Hero Card Highlight Sisa Anggaran (Jumbo)**: Kartu utama berukuran besar dengan gradien navy-emas yang menampilkan sisa anggaran Kanwil beserta rincian sisa per bidang kerja.
* **Pie Chart 1 (Realisasi vs Sisa Anggaran)**: Pie Chart yang menyorot porsi anggaran terpakai dibanding sisa alokasi DIPA.
* **Pie Chart 2 (Sebaran Sisa Per Bidang)**: Doughnut Chart sebaran sisa dana di BagTUM, Doklan, dan Gakkum.
* **Tabel Rekapitulasi Laporan**: Tabel konsolidasi Pagu, Realisasi, % Capaian, dan kolom khusus **Sisa Anggaran** yang di-highlight soft amber.

### 📈 4. Menu Analisis RO (Detail Performa Chart.js)
* **Ranking Performa RO (Horizontal Bar Chart)**: Peringkat capaian realisasi 12 RO teratas dengan indikator warna dinamis.
* **Distribusi Status RO (Doughnut Chart)**: Proporsi kategori Sangat Baik (≥80%), Optimal (50-79%), dan Perlu Dorongan (<50%).
* **Top 5 Pagu vs Realisasi (Grouped Bar Chart)**: Perbandingan alokasi dana vs realisasi untuk RO dengan alokasi anggaran terbesar.
* **Filter & Search Bar**: Pencarian instan per Kode/Nama RO & penyaringan per Bidang Kerja.

### 🖨️ 5. Fitur Cetak Laporan PDF Interaktif (Custom Chart Picker)
* **Pemilihan Komponen per Menu**: Pengguna dapat mencentang/memilih chart mana yang ingin dimasukkan:
  - *Dashboard Utama*: Gauge Circular Chart, Summary Cards, Tabel RO.
  - *Laporan Anggaran*: Hero Card Sisa Anggaran, Pie Chart Realisasi vs Sisa, Pie Chart Sisa per Bidang, Tabel Rekapitulasi.
  - *Analisis RO*: Horizontal Bar Ranking, Status Doughnut Chart, Grouped Bar Top 5.
* **Kelengkapan Kedinasan**: Opsi menyertakan Kop Surat Resmi Kementerian & Lembar Pengesahan Tanda Tangan (PPK & Kepala Kanwil).

---

## 🛠️ 3. Penjelasan untuk Pengembang (Developer Architecture)

### 🏗️ Arsitektur & Teknologi Utama
Aplikasi ini dibangun menggunakan arsitektur **Single-Page Application (SPA)** berbasis CDN modern:

* **Frontend Framework**: [React 18](https://react.dev/) via Unpkg CDN & Babel Standalone (`text/babel`).
* **UI & Styling**: [Tailwind CSS CDN](https://tailwindcss.com/) dengan palet warna khusus Kementerian (Navy `#002147`, Gold `#D4AF37`, Cyan `#00A896`, Slate).
* **Data Visualization**: [Chart.js (v4)](https://www.chartjs.org/) untuk visualisasi Pie Chart, Doughnut Chart, Horizontal Bar Chart, dan Grouped Bar Chart.
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

1. **Dual-Mode Fetching & Failover**:
   * **Mode Utama (API v4)**: Mengakses Google Sheets API Endpoint.
   * **Mode Fallback (CSV Live)**: Jika API Key error/terbatas, beralih ke CSV export URL.
2. **Periodic Auto-Sync**: Sinkronisasi otomatis berjalan setiap **10 detik** (`setInterval`).

---

## 📂 4. Struktur Berkas Proyek

```text
SIKAP/
├── index.html                  # Aplikasi utama (React + Tailwind + Chart.js + Modal Print)
├── server.py                    # Server HTTP lokal berbasis Python (Port 8081)
├── workflow_dipa_gsheets.json   # Konfigurasi n8n workflow DIPA PDF Telegram to Google Sheets
├── n8n_workflow_sikap.json      # Konfigurasi n8n AI webhook engine SIKAP
├── Code.gs                      # Google Apps Script penunjang backend Google Sheet
└── README.md                   # Dokumentasi resmi proyek ini
```

---

## 🖥️ 5. Panduan Jalankan Aplikasi (Quick Start)

### Langkah-Langkah:
1. **Jalankan Server Lokal**:
   ```bash
   python server.py
   ```
2. **Akses Dashboard**:
   Buka browser dan akses:
   👉 **`http://localhost:8081`**

---

*Dokumentasi ini terus diperbarui sesuai dengan perkembangan fitur Sistem SIKAP Kanwil Imigrasi Babel.*
