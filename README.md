# 📊 SIKAP - Sistem Informasi Kinerja & Penyerapan Anggaran
> **Kantor Wilayah Kementerian Imigrasi dan Pemasyarakatan Kepulauan Bangka Belitung**  
> *DIPA Tahun Anggaran 2026*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.x](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![React: 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind: 3.x](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Chart.js: 4.x](https://img.shields.io/badge/Chart.js-4.x-ff6384.svg)](https://www.chartjs.org/)

---

## 📌 1. Penjelasan untuk Orang Awam (Non-Technical Summary)

### Apa itu SIKAP?
**SIKAP** (*Sistem Informasi Kinerja & Penyerapan Anggaran*) adalah platform dashboard monitoring dan evaluasi realisasi anggaran berbasis web yang dirancang khusus untuk mengawal alokasi **Pagu Anggaran**, **Realisasi Penyerapan**, dan **Sisa Anggaran** secara *real-time*, transparan, dan akuntabel di lingkungan Kanwil Kementerian Imigrasi dan Pemasyarakatan Bangka Belitung.

### Mengapa SIKAP Dibutuhkan?
Sebelum hadirnya SIKAP, proses pelaporan dan evaluasi anggaran dilakukan manual dengan merekap berbagai lembar kerja spreadsheet yang rentan selisih dan memakan waktu. Melalui SIKAP:
* 🚀 **Otomatis & Real-Time**: Terintegrasi langsung dengan database Google Sheets dan Google Apps Script. Setiap perubahan data anggaran yang diinput staf langsung tercermin pada grafik dan indikator dalam hitungan detik.
* 🎯 **Pantau Target Anggaran Triwulan**: Membantu pimpinan memantau kepatuhan penyerapan terhadap target berkala (misal: **Target 70% di Triwulan III**).
* 💡 **Highlight Sisa Anggaran (Amber Alert)**: Menyoroti sisa dana yang belum terserap dengan kartu metrik jumbo dan visualisasi porsi sisa agar menjadi prioritas pengawasan percepatan kegiatan.
* 🤖 **Asisten AI & Ekstraksi PDF Otomatis**: Dilengkapi integrasi workflow n8n dan bot Telegram untuk mengekstrak dokumen DIPA PDF secara cerdas menggunakan LLM dan mengumpankannya langsung ke sistem.
* 🖨️ **Cetak Laporan PDF Kustom & Kedinasan**: Memungkinkan pimpinan memilih chart atau tabel tertentu yang ingin dicetak, dilengkapi kop dinas resmi Kementerian dan lembar pengesahan tanda tangan PPK & Kepala Kantor Wilayah.

---

## 🏢 2. Tiga Bidang Kerja Utama Kanwil

SIKAP mengelompokkan anggaran dan Rencana Output (RO) ke dalam 3 divisi operasional:

1. **BagTUM** — *Bagian Tata Usaha dan Umum* (`BAG-TUM`)  
   Mencakup operasional perkantoran, belanja pegawai, sarana prasarana, pengadaan perlengkapan, dan administrasi umum.
2. **Doklan** — *Bidang Dokumen Perjalanan, Izin Tinggal & Status Keimigrasian* (`BID-DOKLAN`)  
   Fokus pada pelayanan paspor, visa, izin tinggal keimigrasian, pemeliharaan sistem keimigrasian, serta pelayanan publik masyarakat dan WNA.
3. **Gakkum** — *Bidang Penegakan Hukum dan Kepatuhan Internal* (`BID-GAKKUM`)  
   Bertanggung jawab atas pengawasan orang asing (TIMPORA), intelijen, penindakan yustisial keimigrasian, dan audit kepatuhan internal.

---

## 🌟 3. Fitur Utama Aplikasi

### 📊 A. Menu Dashboard Utama (`index.html`)
* **3 Kartu Ringkasan Metrik (Key Metric Cards)**:
  * Total Pagu Anggaran Kanwil (DIPA TA 2026).
  * Total Realisasi Anggaran dengan persentase capaian nasional/wilayah.
  * Sisa Pagu Anggaran yang belum terserap.
* **Gauge Circular Chart**: Indikator radial persentase penyerapan kumulatif seluruh bidang.
* **Kartu Capaian per Bidang**: Visualisasi interaktif untuk BagTUM, Doklan, dan Gakkum beserta status performa.
* **Tabel Rincian Rencana Output (RO)**: Tabel interaktif berisi nomor, kode RO, nama kegiatan, alokasi pagu, realisasi, progress bar dinamis, dan lencana status (*Sangat Baik*, *Optimal*, *Perlu Dorongan*).
* **Pencarian & Filter Instan**: Pencarian cepat berdasarkan kode atau nama RO serta penyaringan berdasarkan bidang.

### 📑 B. Menu Laporan Anggaran
* **Hero Card Highlight Sisa Anggaran (Jumbo)**: Kartu visual besar bergradien navy-emas yang memaparkan rincian nominal sisa anggaran per bidang kerja.
* **Pie Chart: Realisasi vs Sisa Anggaran**: Perbandingan visual proporsi dana terserap vs dana sisa dari total alokasi DIPA.
* **Doughnut Chart: Sebaran Sisa per Bidang**: Distribusi sisa pagu antara BagTUM, Doklan, dan Gakkum.
* **Tabel Rekapitulasi Laporan**: Konsolidasi menyeluruh mencakup pagu, realisasi, persentase, dan kolom sisa anggaran dengan highlight warna khusus.

### 📈 C. Menu Analisis RO (Performa Chart.js)
* **Horizontal Bar Chart (Ranking RO)**: Pemeringkatan 12 Rencana Output teratas berdasarkan persentase penyerapan dengan palet warna otomatis (hijau, kuning, merah).
* **Doughnut Chart Distribusi Status RO**: Proporsi jumlah kegiatan berdasarkan kategori *Sangat Baik* (≥80%), *Optimal* (50–79%), dan *Perlu Dorongan* (<50%).
* **Grouped Bar Chart (Top 5 Pagu vs Realisasi)**: Perbandingan alokasi pagu terhadap serapan riil untuk 5 kegiatan dengan anggaran terbesar.

### 🖨️ D. Modal Cetak Laporan PDF Interaktif
* **Pemilih Komponen Cetak (Custom Component Picker)**: Pengguna dapat mencentang modul mana saja yang ingin disertakan ke laporan cetak:
  * *Dashboard*: Gauge Chart, Summary Cards, Tabel RO.
  * *Laporan*: Hero Card Sisa, Pie Realisasi vs Sisa, Doughnut Sebaran Sisa, Tabel Rekap.
  * *Analisis*: Ranking Bar, Status Doughnut, Top 5 Grouped Bar.
* **Format Dokumen Kedinasan Resmi**:
  * Kop Surat Resmi Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia.
  * Judul dokumen, nomor laporan, dan tanggal cetak otomatis.
  * Lembar pengesahan tanda tangan ganda: **Pejabat Pembuat Komitmen (PPK)** dan **Kepala Kantor Wilayah**.
* **Mode Siap Cetak (Print Stylesheet)**: Halaman otomatis dioptimalkan untuk ukuran kertas A4, margin rapi, dan pemotongan halaman teratur (`page-break-inside: avoid`).

### 🤖 E. Simulasi & AI Jarvis DIPA Assistant (`simulasi.html`)
* **Asisten Interaktif DIPA**: Chat assistant untuk menganalisis data serapan anggaran, memberikan saran percepatan, dan rekomendasi realokasi anggaran.
* **Simulasi Anggaran & What-If Analysis**: Pengujian skenario realisasi dan pergeseran pagu antar-kegiatan tanpa mengubah data produksi secara langsung.
* **Proxy Webhook n8n Terintegrasi**: Jalur komunikasi aman tanpa kendala CORS antara browser dengan workflow AI.

---

## 🔄 4. Alur Integrasi Data & Arsitektur Sistem

```text
       ┌────────────────────────┐
       │ Dokumen DIPA 2026 (PDF)│
       └───────────┬────────────┘
                   │ Kirim via Telegram
                   ▼
       ┌────────────────────────┐
       │   Telegram Bot (n8n)   │  ───> workflow_dipa_gsheets.json
       └───────────┬────────────┘       (LLM Information Extractor)
                   │ Ekstrak JSON
                   ▼
       ┌────────────────────────┐
       │ Google Sheets Database │  ───> Spreadsheet ID: 1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0
       └───────────┬────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌──────────────────┐ ┌──────────────────┐
│ Google Apps      │ │ CSV Export       │
│ Script (Code.gs) │ │ Live (Fallback)  │
└────────┬─────────┘ └────────┬─────────┘
         │                    │
         └─────────┬──────────┘
                   ▼
       ┌────────────────────────┐
       │  SIKAP Local Server    │  ───> server.py (Port 8081)
       │  (Reverse Proxy /n8n)  │       Proxy ke n8n AI webhook
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │  Frontend Dashboard    │  ───> React 18, Tailwind CSS, Chart.js
       │  (index.html)          │       Auto-refresh interval 10 detik
       └────────────────────────┘
```

1. **Dual-Mode Data Ingestion**:
   * **Mode Utama**: Mengambil data terstruktur via REST API Google Apps Script (`Code.gs`) yang mereturn JSON bersih.
   * **Mode Fallback**: Mengunduh langsung data CSV dari Google Sheets jika kuota API tercapai atau jaringan terbatas.
2. **Periodic Auto-Sync**: Dashboard secara otomatis memeriksa pembaruan data setiap **10 detik**.
3. **Local Reverse Proxy**: `server.py` menyediakan rute `POST /proxy/n8n` dengan timeout 120 detik untuk meneruskan prompt analisis ke AI engine di cloud tanpa hambatan CORS browser.

---

## 📂 5. Struktur Berkas Proyek

```text
SIKAP/
├── index.html                  # Aplikasi Dashboard Utama (React 18 + Tailwind + Chart.js + Modal Cetak)
├── simulasi.html               # Halaman Simulasi Interaktif & Asisten AI DIPA (Jarvis)
├── server.py                   # Local HTTP & Webhook Proxy Server (Python standard library, Port 8081)
├── SIKAP_Server.vbs            # Launcher senyap (background silent) untuk Windows
├── Code.gs                     # Google Apps Script Web App Backend (Realtime Google Sheets REST API)
├── requirements.txt            # Keterangan dependensi (Zero third-party library required)
├── n8n_workflow_sikap.json      # Konfigurasi n8n AI Webhook Engine & Action Router
├── workflow_dipa_gsheets.json   # Konfigurasi n8n Telegram Bot PDF Extractor to Google Sheets
├── README.md                   # Dokumentasi resmi proyek SIKAP
│
├── css/
│   └── styles.css              # Custom styling, scrollbar, print layout & utility classes
│
├── js/
│   ├── api.js                  # Modul integrasi ke backend n8n Webhook & GSheets API
│   ├── app.js                  # Controller tabel data, kalkulasi DIPA, dan CRUD
│   ├── appscript-template.js   # Template referensi Google Apps Script
│   ├── charts.js               # Konfigurasi dan perenderan dinamis grafik Chart.js
│   ├── database.js             # Skema data lokal dan mock database cadangan
│   ├── jarvis.js               # Handler prompt chat AI dan pembaruan grafik dinamis
│   └── runtime.txt             # Catatan konfigurasi runtime JavaScript
│
└── img/
    ├── logo_kemenimipas.png    # Lambang resmi Kementerian Imigrasi dan Pemasyarakatan
    └── logo_kemenimipas_official.png # Logo resmi resolusi tinggi untuk Kop Surat Cetak
```

---

## 🚀 6. Panduan Menjalankan Aplikasi (Quick Start)

### Prasyarat
* **Python 3.8+** terpasang di sistem operasi (Windows / macOS / Linux).
* Tidak memerlukan instalasi paket tambahan (`pip install`), seluruh modul server menggunakan **Python Standard Library** bawaan.

### Langkah Menjalankan:

#### Opsi 1: Menjalankan via Terminal / Command Prompt
1. Buka folder proyek di terminal:
   ```bash
   cd c:\Users\user\Downloads\SIKAP
   ```
2. Jalankan script server:
   ```bash
   python server.py
   ```
3. Browser akan otomatis terbuka ke:
   👉 **`http://localhost:8081`**
4. Untuk mengakses dari perangkat lain (HP / Tablet / Laptop satu jaringan LAN):
   Akses melalui IP lokal yang tampil di konsol, contoh: **`http://192.168.1.x:8081`**

#### Opsi 2: Menjalankan di Latar Belakang (Windows Silent Mode)
Cukup klik ganda berkas **`SIKAP_Server.vbs`**. Server akan berjalan secara senyap di latar belakang menggunakan `pythonw.exe`.

---

## ⚙️ 7. Panduan Pemasangan Backend (Google Sheets & n8n)

### A. Pemasangan Google Apps Script (`Code.gs`)
1. Buka Google Sheet database Anda:
   👉 [Google Sheets DIPA Kanwil](https://docs.google.com/spreadsheets/d/1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0/edit)
2. Klik menu **Ekstensi** > **Apps Script** (*Extensions* > *Apps Script*).
3. Hapus kode default, lalu salin dan tempel seluruh isi berkas [`Code.gs`](file:///c:/Users/user/Downloads/SIKAP/Code.gs).
4. Klik **Simpan** (ikon disket).
5. Klik **Terapkan** > **Terapkan sebagai Aplikasi Web** (*Deploy* > *New Deployment*).
   * **Jenis**: Aplikasi Web (*Web App*)
   * **Jalankan sebagai**: Saya (*Me*)
   * **Akses**: Siapa saja (*Anyone*)
6. Klik **Terapkan** (*Deploy*), salin URL Web App yang dihasilkan.

### B. Import Workflow n8n
1. Buka dashboard instance n8n Anda.
2. Buat workflow baru dan pilih **Import from File**:
   * Impor [`workflow_dipa_gsheets.json`](file:///c:/Users/user/Downloads/SIKAP/workflow_dipa_gsheets.json) untuk automasi upload PDF via Telegram.
   * Impor [`n8n_workflow_sikap.json`](file:///c:/Users/user/Downloads/SIKAP/n8n_workflow_sikap.json) untuk webhook router query AI.
3. Hubungkan kredensial Google Service Account dan Token Bot Telegram Anda.
4. Aktifkan workflow (*Active*).

---

## 🐙 8. Manajemen Git & GitHub Repository

Proyek ini telah dikonfigurasi untuk terhubung dengan repository GitHub:

* **Remote Origin**: `https://github.com/malikamrullah131/jarvis.git`
* **Default Branch**: `main`

### Perintah Standar Sinkronisasi Git:
```bash
# Periksa status perubahan berkas
git status

# Tambahkan perubahan berkas ke staging area
git add .

# Buat commit perubahan
git commit -m "docs: update comprehensive README and architecture documentation"

# Dorong (push) perubahan ke repositori GitHub
git push origin main
```

---

## 👥 9. Tim Pengembang & Kontak

* **Instansi**: Kantor Wilayah Kementerian Imigrasi dan Pemasyarakatan Kepulauan Bangka Belitung
* **Divisi**: Pengelola Keuangan dan Anggaran (DIPA 2026)
* **Email Kontak**: `kanwil.babel@imigrasi.go.id`

---
*Dokumentasi ini dipelihara dan diperbarui secara berkala mengikuti pembaruan fitur Sistem SIKAP.*
