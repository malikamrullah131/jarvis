import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Wallet,
  Coins,
  ShieldAlert,
  Building2,
  FileCheck2,
  ChevronRight,
  Search,
  X,
  Filter,
  Download,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// Data Dataset (Berdasarkan Laporan Kinerja Penyerapan Anggaran Q3 - 18 September 2026)
const DIVISION_DATA = {
  bagtum: {
    id: 'bagtum',
    name: 'Bagian Tata Usaha dan Umum',
    shortName: 'BagTUM',
    program: 'Program WA.6163',
    code: 'BAG-TUM',
    pagu: 8001600000,
    paguLabel: 'Rp 8,00 M',
    realisasi: 6714328264,
    realisasiLabel: 'Rp 6,71 M',
    sisa: 1287271736,
    persentase: 83.91,
    themeColor: '#002147',
    accentColor: '#D4AF37',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    accentBorder: 'border-l-[#D4AF37]',
    icon: Building2,
    roList: [
      {
        kode: 'EBD.Z27',
        nama: 'Layanan Manajemen Keuangan',
        pagu: 8008000,
        realisasi: 8006700,
        persentase: 99.98
      },
      {
        kode: 'EBB.951',
        nama: 'Layanan Sarana Internal',
        pagu: 515000000,
        realisasi: 514485000,
        persentase: 99.90
      },
      {
        kode: 'EBA.994',
        nama: 'Layanan Perkantoran',
        pagu: 5918654000,
        realisasi: 5221535480,
        persentase: 88.22
      },
      {
        kode: 'EBD.001',
        nama: 'Koordinasi dan Konsultasi Perencanaan dan Pelaksanaan Anggaran',
        pagu: 403065000,
        realisasi: 288744000,
        persentase: 71.64
      },
      {
        kode: 'EBA.Z07',
        nama: 'Layanan BMN',
        pagu: 3834000,
        realisasi: 2746000,
        persentase: 71.62
      },
      {
        kode: 'EBA.962',
        nama: 'Layanan Umum',
        pagu: 487117000,
        realisasi: 334864284,
        persentase: 68.74
      },
      {
        kode: 'EBA.963',
        nama: 'Layanan Data dan Informasi',
        pagu: 393266000,
        realisasi: 217343000,
        persentase: 55.27
      },
      {
        kode: 'EBC.954',
        nama: 'Layanan Manajemen SDM',
        pagu: 272655000,
        realisasi: 126603800,
        persentase: 46.43
      },
      {
        kode: 'EBD.Z32',
        nama: 'Layanan Reformasi Kinerja',
        pagu: 1000,
        realisasi: 0,
        persentase: 0.00
      }
    ]
  },
  doklan: {
    id: 'doklan',
    name: 'Bidang Dokumen Perjalanan, Izin Tinggal & Status Keimigrasian',
    shortName: 'Doklanianstak',
    program: 'Program BF.6161',
    code: 'BID-DOKLAN',
    pagu: 1020013000,
    paguLabel: 'Rp 1,02 M',
    realisasi: 573044800,
    realisasiLabel: 'Rp 0,57 M',
    sisa: 446968200,
    persentase: 56.18,
    themeColor: '#00A896',
    accentColor: '#00A896',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    accentBorder: 'border-l-[#00A896]',
    icon: FileCheck2,
    roList: [
      {
        kode: 'EBD.001',
        nama: 'Pembinaan dan Koordinasi Bidang Layanan Keimigrasian',
        pagu: 1020013000,
        realisasi: 573044800,
        persentase: 56.18
      }
    ]
  },
  gakkum: {
    id: 'gakkum',
    name: 'Bidang Penegakan Hukum dan Kepatuhan Internal',
    shortName: 'Gakkum & Patnal',
    program: 'Program BF.6161',
    code: 'BID-GAKKUM',
    pagu: 2688976000,
    paguLabel: 'Rp 2,68 M',
    realisasi: 1239693600,
    realisasiLabel: 'Rp 1,23 M',
    sisa: 1449282400,
    persentase: 46.10,
    themeColor: '#E63946',
    accentColor: '#D97706',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    accentBorder: 'border-l-[#E63946]',
    icon: ShieldAlert,
    roList: [
      {
        kode: 'BHB.U11',
        nama: 'Operasi Intelijen Keimigrasian di Wilayah Barat',
        pagu: 248880000,
        realisasi: 232111600,
        persentase: 93.26
      },
      {
        kode: 'QHB.U02',
        nama: 'Operasi Mandiri di Wilayah',
        pagu: 161924000,
        realisasi: 134011300,
        persentase: 82.76
      },
      {
        kode: 'EBD.002',
        nama: 'Pembinaan dan Koordinasi Bidang Intelijen, Penegakan Hukum dan Kepatuhan Internal Keimigrasian',
        pagu: 1493694000,
        realisasi: 722813300,
        persentase: 48.39
      },
      {
        kode: 'BKA.001',
        nama: 'Pengawasan Keimigrasian',
        pagu: 323697000,
        realisasi: 135589400,
        persentase: 41.89
      },
      {
        kode: 'BHB.U17',
        nama: 'Penyidikan Tindak Pidana Keimigrasian di Wilayah Barat',
        pagu: 71824000,
        realisasi: 10458000,
        persentase: 14.56
      },
      {
        kode: 'BHB.U14',
        nama: 'Operasi Gabungan di Wilayah Barat',
        pagu: 62891000,
        realisasi: 4200000,
        persentase: 6.68
      },
      {
        kode: 'BIB.001',
        nama: 'Tindakan Administratif Keimigrasian',
        pagu: 326066000,
        realisasi: 510000,
        persentase: 0.16
      }
    ]
  }
};

// Google Sheet Live Connection Config
const SPREADSHEET_ID = "1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0";
// Salin & Tempel URL Web App dari Google Apps Script di sini (Opsional):
const APPS_SCRIPT_URL = ""; 
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

const parseAmount = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let str = val.toString().replace(/Rp|\s/gi, '').replace(/\./g, '').replace(',', '.').trim();
  let num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const parsePercentage = (val, pagu, realisasi) => {
  if (typeof val === 'number') return val;
  if (val) {
    let str = val.toString().replace(/%|\s/gi, '').replace(',', '.').trim();
    let num = parseFloat(str);
    if (!isNaN(num)) return num;
  }
  let p = parseAmount(pagu);
  let r = parseAmount(realisasi);
  return p > 0 ? (r / p) * 100 : 0;
};

function parseCSV(text) {
  let lines = text.split('\n');
  let result = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    let row = [];
    let insideQuote = false;
    let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      let char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim().replace(/^"|"$/g, ''));
    result.push(row);
  }
  return result;
}

const SUMMARY_DATA = {
  paguTotal: 11710589000,
  paguFormatted: 'Rp 11.710.589.000',
  realisasiTotal: 8527066664,
  realisasiFormatted: 'Rp 8.527.066.664',
  sisaTotal: 3184522336,
  sisaFormatted: 'Rp 3.184.522.336',
  persentaseTotal: 72.82,
  period: 'Q3 - 18 September 2026'
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function SikapDashboard() {
  const [selectedBidang, setSelectedBidang] = useState('bagtum');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionData, setDivisionData] = useState(DIVISION_DATA);
  const [summaryData, setSummaryData] = useState(SUMMARY_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Otomatis');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchGoogleSheetData = useCallback(async () => {
    try {
      setIsSyncing(true);
      let items = [];

      if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim() !== "") {
        const res = await fetch(APPS_SCRIPT_URL + '?_t=' + Date.now());
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          items = json.data;
        }
      }

      if (items.length === 0) {
        const res = await fetch(GOOGLE_SHEET_CSV_URL + '&_t=' + Date.now());
        if (!res.ok) throw new Error('Gagal mengambil data dari Google Sheet');
        const csvText = await res.text();
        const rows = parseCSV(csvText);

        if (rows.length > 1) {
          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (row.length < 5) continue;
            items.push({
              id: row[0],
              kode_program: row[1],
              bidang_bagian: row[2],
              kode_ro: row[3],
              nama_ro: row[4],
              pagu: parseAmount(row[5]),
              realisasi: parseAmount(row[6]),
              sisa: parseAmount(row[7]),
              persentase: parsePercentage(row[8], row[5], row[6])
            });
          }
        }
      }

      if (items.length > 0) {
        let newDivData = { ...DIVISION_DATA };
        let totalKanwilPagu = 0;
        let totalKanwilRealisasi = 0;

        ['bagtum', 'doklan', 'gakkum'].forEach((divKey) => {
          let divCode = divKey === 'bagtum' ? 'BagTUM' : divKey === 'doklan' ? 'Doklan' : 'Gakkum';
          let matching = items.filter(it => it.bidang_bagian.toLowerCase() === divCode.toLowerCase());

          if (matching.length > 0) {
            let subPagu = matching.reduce((sum, item) => sum + item.pagu, 0);
            let subRealisasi = matching.reduce((sum, item) => sum + item.realisasi, 0);
            let subPct = subPagu > 0 ? (subRealisasi / subPagu) * 100 : 0;

            newDivData[divKey] = {
              ...newDivData[divKey],
              pagu: subPagu,
              paguLabel: `Rp ${(subPagu / 1000000000).toFixed(2)} M`,
              realisasi: subRealisasi,
              realisasiLabel: `Rp ${(subRealisasi / 1000000000).toFixed(2)} M`,
              sisa: subPagu - subRealisasi,
              persentase: subPct,
              roList: matching.map(m => ({
                kode: m.kode_ro,
                nama: m.nama_ro,
                pagu: m.pagu,
                realisasi: m.realisasi,
                persentase: m.persentase
              }))
            };
          }

          totalKanwilPagu += newDivData[divKey].pagu;
          totalKanwilRealisasi += newDivData[divKey].realisasi;
        });

        let totalSisa = totalKanwilPagu - totalKanwilRealisasi;
        let totalPct = totalKanwilPagu > 0 ? (totalKanwilRealisasi / totalKanwilPagu) * 100 : 0;

        setDivisionData(newDivData);
        setSummaryData({
          paguTotal: totalKanwilPagu,
          paguFormatted: formatCurrency(totalKanwilPagu),
          realisasiTotal: totalKanwilRealisasi,
          realisasiFormatted: formatCurrency(totalKanwilRealisasi),
          sisaTotal: totalSisa,
          sisaFormatted: formatCurrency(totalSisa),
          persentaseTotal: parseFloat(totalPct.toFixed(2)),
          period: 'Realtime Google Sheet'
        });

        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (err) {
      console.warn("Realtime sync notice:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchGoogleSheetData();
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchGoogleSheetData();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [fetchGoogleSheetData, autoRefresh]);

  const currentBidang = divisionData[selectedBidang] || DIVISION_DATA[selectedBidang];

  const filteredROList = currentBidang.roList.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SVG Circular Gauge calculation
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (summaryData.persentaseTotal / 100) * circumference;


  return (
    <div className="flex h-screen bg-[#F0F4F9] font-sans text-slate-800 antialiased overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION (Light Theme Modern Style) */}
      <aside className="w-64 bg-white text-slate-800 flex flex-col justify-between shrink-0 shadow-sm border-r border-slate-200/80 z-20">
        <div>
          {/* Brand Header with Official Ministry Logo */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full p-0.5 bg-gradient-to-br from-[#002147] to-[#D4AF37] shadow-sm shrink-0 flex items-center justify-center">
                <img
                  src="img/logo_kemenimipas.png"
                  alt="Logo Kementerian Imigrasi dan Pemasyarakatan RI"
                  className="w-full h-full object-contain rounded-full bg-[#002147]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span className="text-[#D4AF37] font-black text-xl">S</span>';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[#002147]">SIKAP</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 tracking-tight font-semibold">
                  Kanwil Imigrasi Babel
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </p>
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeNav === 'dashboard'
                  ? 'bg-[#002147] text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Utama</span>
            </button>

            <button
              onClick={() => setActiveNav('laporan')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeNav === 'laporan'
                  ? 'bg-[#002147] text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan Anggaran</span>
            </button>

            <button
              onClick={() => setActiveNav('analisis')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeNav === 'analisis'
                  ? 'bg-[#002147] text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Analisis RO</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#002147]/10 border border-[#002147]/20 flex items-center justify-center text-[#002147] font-bold text-sm">
              KB
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Kanwil Babel</p>
              <p className="text-[10px] text-slate-500 truncate">kanwil.babel@imigrasi.go.id</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-[#F0F4F9]">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Monitoring Penyerapan Anggaran Kanwil Imigrasi Babel</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Calendar className="w-3 h-3 text-blue-600" />
                Data Period: {summaryData.period}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Sistem Informasi Kinerja & Penyerapan Anggaran</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchGoogleSheetData}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#002147] bg-amber-50 hover:bg-amber-100 rounded-xl transition border border-amber-200 shadow-xs cursor-pointer"
              title="Manual Sync Database Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#002147] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Memuat Data...' : `Update: ${lastSyncTime}`}</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition border border-slate-200 shadow-xs">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Laporan</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Realtime Active</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Key Metrics Cards (Clean Modern Light Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Total Pagu */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL PAGU ANGGARAN
                </span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {summaryData.paguFormatted}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">DIPA TA 2026</span>
                  <span>•</span>
                  <span>3 Bidang Kerja</span>
                </div>
              </div>
            </div>

            {/* 2. Total Realisasi */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL REALISASI ANGGARAN
                </span>
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {summaryData.realisasiFormatted}
                  </span>
                  <span className="text-xs font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    {summaryData.persentaseTotal}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${summaryData.persentaseTotal}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Sisa Anggaran */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SISA PAGU ANGGARAN
                </span>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {summaryData.sisaFormatted}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Sisa Realisasi:</span>
                  <span className="font-semibold text-slate-700">
                    {(100 - summaryData.persentaseTotal).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Interactive Division Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: Main Donut Chart (Total Kanwil Realization) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Penyerapan Kanwil Total
                  </h2>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    Target: 70% Q3
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Realisasi kumulatif anggaran seluruh bidang kerja
                </p>
              </div>

              {/* Donut Gauge Visual (Bright Electric Cyan/Blue Gauge like Reference PDF Page 2) */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#E2E8F0"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    {/* Realization Progress circle (Cyan / Blue Gradient) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#06B6D4"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out drop-shadow-sm"
                    />
                  </svg>
                  {/* Center Text inside Donut */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      {summaryData.persentaseTotal.toFixed(2)}%
                    </span>
                    <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mt-0.5">
                      Tercapai
                    </span>
                  </div>
                </div>
              </div>

              {/* Donut Chart Legend / Mini Breakdown */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-cyan-50/80 border border-cyan-100">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Realisasi</p>
                    <p className="font-bold text-slate-900">Rp {(summaryData.realisasiTotal / 1000000000).toFixed(2)} M ({summaryData.persentaseTotal.toFixed(1)}%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Sisa Pagu</p>
                    <p className="font-bold text-slate-700">Rp {(summaryData.sisaTotal / 1000000000).toFixed(2)} M ({(100 - summaryData.persentaseTotal).toFixed(1)}%)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: 3 Interactive Division Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-base font-bold text-[#002147] tracking-tight">
                    Kinerja Penyerapan per Bidang
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih kartu untuk melihat rincian Rencana Output (RO) di bawah
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  3 Satuan Bidang
                </span>
              </div>

              {/* 3 Division Cards List */}
              <div className="space-y-3">
                {Object.values(divisionData).map((div) => {
                  const isSelected = selectedBidang === div.id;
                  const DivIcon = div.icon;

                  return (
                    <div
                      key={div.id}
                      onClick={() => setSelectedBidang(div.id)}
                      className={`cursor-pointer group relative rounded-xl border-l-4 transition-all duration-300 ease-in-out transform origin-center ${div.accentBorder} ${
                        isSelected
                          ? 'p-4 md:p-5 bg-white border border-slate-300 ring-2 ring-[#002147] shadow-xl scale-100 opacity-100 z-10'
                          : 'p-2.5 md:p-3 bg-slate-100/60 border border-slate-200 hover:bg-white hover:border-slate-300 scale-[0.96] opacity-65 hover:opacity-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 md:gap-3">
                          <div
                            className={`rounded-xl transition-all duration-300 ${
                              isSelected ? 'p-2.5 shadow-sm' : 'p-1.5'
                            }`}
                            style={{
                              backgroundColor: `${div.themeColor}${isSelected ? '20' : '10'}`,
                              color: div.themeColor
                            }}
                          >
                            <DivIcon className={isSelected ? "w-5 h-5" : "w-4 h-4"} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className={`font-bold transition-all duration-300 ${
                                  isSelected ? 'text-base text-[#002147]' : 'text-xs text-slate-700'
                                }`}
                              >
                                {div.name}
                              </h3>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 font-semibold">
                                {div.code}
                              </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-all duration-300 ${isSelected ? 'mt-1.5 text-xs text-slate-600' : 'mt-0.5 text-[11px] text-slate-500'}`}>
                              <span>
                                Pagu: <strong className="text-slate-800">{div.paguLabel}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Realisasi: <strong className="text-slate-800">{div.realisasiLabel}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Percentage & Active Arrow */}
                        <div className="flex items-center gap-2.5 text-right shrink-0">
                          <div>
                            <div
                              className={`font-black tracking-tight transition-all duration-300 ${
                                isSelected ? 'text-xl' : 'text-sm'
                              }`}
                              style={{ color: div.themeColor }}
                            >
                              {div.persentase.toFixed(2)}%
                            </div>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                              Realisasi
                            </span>
                          </div>
                          <div
                            className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? 'w-7 h-7 bg-[#002147] text-white rotate-90 shadow-md'
                                : 'w-5 h-5 bg-slate-200/80 text-slate-500 group-hover:bg-slate-300'
                            }`}
                          >
                            <ChevronRight className={isSelected ? "w-4 h-4" : "w-3 h-3"} />
                          </div>
                        </div>
                      </div>

                      {/* Division Progress Bar */}
                      <div className={`w-full bg-slate-200/70 rounded-full overflow-hidden transition-all duration-300 ${
                        isSelected ? 'mt-3 h-2' : 'mt-2 h-1 opacity-70'
                      }`}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${div.persentase}%`,
                            backgroundColor: div.themeColor
                          }}
                        />
                      </div>

                      {/* Active Pill (Only shown when Selected to expand card height) */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] animate-fadeIn">
                          <span className="font-semibold text-[#002147] flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full animate-ping"
                              style={{ backgroundColor: div.themeColor }}
                            />
                            Bidang Aktif Dipilih
                          </span>
                          <span className="font-bold text-[#002147]">
                            {div.roList.length} Rencana Output (RO)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail RO Table Section (Clean Light Style) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-8 rounded-full"
                  style={{ backgroundColor: currentBidang.themeColor }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Daftar Rencana Output (RO) - {currentBidang.name}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentBidang.badgeClass}`}
                    >
                      {currentBidang.persentase.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Menampilkan rincian alokasi anggaran dan serapan target output kegiatan ({currentBidang.program})
                  </p>
                </div>
              </div>

              {/* Search Box with Lucide-React Search and X Icons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kode atau nama RO..."
                    className="pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-64 text-slate-700 shadow-xs transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition"
                      title="Hapus pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 w-16 text-center">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3.5 w-32">
                      Kode RO
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Nama Rencana Output (RO)
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Pagu (Rp)
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Realisasi (Rp)
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center w-40">
                      Capaian (%)
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center w-28">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredROList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                        Tidak ada Rencana Output yang cocok dengan pencarian "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredROList.map((ro, index) => {
                      const isHigh = ro.persentase >= 80;
                      const isMid = ro.persentase >= 50 && ro.persentase < 80;

                      return (
                        <tr
                          key={ro.kode + index}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-center font-semibold text-slate-400">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200/80">
                              {ro.kode}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {ro.nama}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-600 font-mono">
                            {formatCurrency(ro.pagu)}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 font-mono">
                            {formatCurrency(ro.realisasi)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center">
                              <span className="font-black text-xs text-slate-900">
                                {ro.persentase.toFixed(2)}%
                              </span>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                <div
                                  className="h-1.5 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(ro.persentase, 100)}%`,
                                    backgroundColor: isHigh
                                      ? '#10B981'
                                      : isMid
                                      ? '#F59E0B'
                                      : '#EF4444'
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isHigh ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Sangat Baik
                              </span>
                            ) : isMid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Optimal
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Perlu Dorongan
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {/* Table Footer Summary */}
                <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
                  <tr>
                    <td colSpan="3" className="px-6 py-3.5 text-right uppercase text-[11px] text-slate-500">
                      Total Sub Pagu & Realisasi ({currentBidang.shortName}):
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-black text-slate-800">
                      {formatCurrency(currentBidang.pagu)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-black text-slate-900">
                      {formatCurrency(currentBidang.realisasi)}
                    </td>
                    <td className="px-6 py-3.5 text-center font-mono font-black text-blue-700">
                      {currentBidang.persentase.toFixed(2)}%
                    </td>
                    <td className="px-6 py-3.5"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

