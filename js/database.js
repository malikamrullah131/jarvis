/**
 * SIKAP Database Manager
 * Context: Kantor Wilayah Kementerian Imigrasi dan Pemasyarakatan Bangka Belitung
 * Synchronized with Google Spreadsheet: 1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0
 * Handles local state, filtering, CRUD methods, and n8n webhook data exchange.
 */

window.DatabaseManager = (function() {
  // Official Dataset from Google Spreadsheet T.A. 2026 Kanwil Kemenimipas Babel (17 Rencana Output)
  const DEFAULT_RECORDS = [
    {
      id: "RO-001",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBD.Z27",
      nama_ro: "Layanan Manajemen Keuangan",
      pagu: 8008000,
      realisasi: 8006700,
      sisa: 1300,
      persentase: 99.98,
      status: "Sangat Baik",
      date: "2026-09-18"
    },
    {
      id: "RO-002",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBB.951",
      nama_ro: "Layanan Sarana Internal",
      pagu: 515000000,
      realisasi: 514485000,
      sisa: 515000,
      persentase: 99.90,
      status: "Sangat Baik",
      date: "2026-09-18"
    },
    {
      id: "RO-003",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBA.994",
      nama_ro: "Layanan Perkantoran",
      pagu: 5918654000,
      realisasi: 5221535480,
      sisa: 697118520,
      persentase: 88.22,
      status: "Sangat Baik",
      date: "2026-09-18"
    },
    {
      id: "RO-004",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBD.001",
      nama_ro: "Koordinasi dan Konsultasi Perencanaan dan Pelaksanaan Anggaran",
      pagu: 403065000,
      realisasi: 288744000,
      sisa: 114321000,
      persentase: 71.64,
      status: "Optimal",
      date: "2026-09-18"
    },
    {
      id: "RO-005",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBA.Z07",
      nama_ro: "Layanan BMN",
      pagu: 3834000,
      realisasi: 2746000,
      sisa: 1088000,
      persentase: 71.62,
      status: "Optimal",
      date: "2026-09-18"
    },
    {
      id: "RO-006",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBA.962",
      nama_ro: "Layanan Umum",
      pagu: 487117000,
      realisasi: 334864284,
      sisa: 152252716,
      persentase: 68.74,
      status: "Optimal",
      date: "2026-09-18"
    },
    {
      id: "RO-007",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBA.963",
      nama_ro: "Layanan Data dan Informasi",
      pagu: 393266000,
      realisasi: 217343000,
      sisa: 175923000,
      persentase: 55.27,
      status: "Optimal",
      date: "2026-09-18"
    },
    {
      id: "RO-008",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBC.954",
      nama_ro: "Layanan Manajemen SDM",
      pagu: 272655000,
      realisasi: 126603800,
      sisa: 146051200,
      persentase: 46.43,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-009",
      kode_program: "WA.6163",
      bidang_bagian: "BagTUM",
      kode_ro: "EBD.Z32",
      nama_ro: "Layanan Reformasi Kinerja",
      pagu: 1000,
      realisasi: 0,
      sisa: 1000,
      persentase: 0.00,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-010",
      kode_program: "BF.6161",
      bidang_bagian: "Doklan",
      kode_ro: "EBD.001",
      nama_ro: "Pembinaan dan Koordinasi Bidang Layanan Keimigrasian",
      pagu: 1020013000,
      realisasi: 573044800,
      sisa: 446968200,
      persentase: 56.18,
      status: "Optimal",
      date: "2026-09-18"
    },
    {
      id: "RO-011",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "BHB.U11",
      nama_ro: "Operasi Intelijen Keimigrasian di Wilayah Barat",
      pagu: 248880000,
      realisasi: 232111600,
      sisa: 16768400,
      persentase: 93.26,
      status: "Sangat Baik",
      date: "2026-09-18"
    },
    {
      id: "RO-012",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "QHB.U02",
      nama_ro: "Operasi Mandiri di Wilayah",
      pagu: 161924000,
      realisasi: 134011300,
      sisa: 27912700,
      persentase: 82.76,
      status: "Sangat Baik",
      date: "2026-09-18"
    },
    {
      id: "RO-013",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "EBD.002",
      nama_ro: "Pembinaan dan Koordinasi Bidang Intelijen, Penegakan Hukum dan Kepatuhan Internal Keimigrasian",
      pagu: 1493694000,
      realisasi: 722813300,
      sisa: 770880700,
      persentase: 48.39,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-014",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "BKA.001",
      nama_ro: "Pengawasan Keimigrasian",
      pagu: 323697000,
      realisasi: 135589400,
      sisa: 188107600,
      persentase: 41.89,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-015",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "BHB.U17",
      nama_ro: "Penyidikan Tindak Pidana Keimigrasian di Wilayah Barat",
      pagu: 71824000,
      realisasi: 10458000,
      sisa: 61366000,
      persentase: 14.56,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-016",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "BHB.U14",
      nama_ro: "Operasi Gabungan di Wilayah Barat",
      pagu: 62891000,
      realisasi: 4200000,
      sisa: 58691000,
      persentase: 6.68,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    },
    {
      id: "RO-017",
      kode_program: "BF.6161",
      bidang_bagian: "Gakkum",
      kode_ro: "BIB.001",
      nama_ro: "Tindakan Administratif Keimigrasian",
      pagu: 326066000,
      realisasi: 510000,
      sisa: 325556000,
      persentase: 0.16,
      status: "Perlu Dorongan",
      date: "2026-09-18"
    }
  ];

  let records = [];

  function init() {
    const saved = localStorage.getItem("sikap_db_records_babel_v2");
    if (saved) {
      try {
        records = JSON.parse(saved);
      } catch (e) {
        records = [...DEFAULT_RECORDS];
      }
    } else {
      records = [...DEFAULT_RECORDS];
      saveToStorage();
    }
  }

  function saveToStorage() {
    localStorage.setItem("sikap_db_records_babel_v2", JSON.stringify(records));
  }

  function getAllRecords() {
    return records;
  }

  function setRecords(newRecords) {
    if (Array.isArray(newRecords) && newRecords.length > 0) {
      records = newRecords;
      saveToStorage();
    }
  }

  function getRecordById(id) {
    return records.find(r => r.id === id || r.kode_ro === id);
  }

  function addRecord(item) {
    const pagu = parseFloat(item.pagu) || 0;
    const realisasi = parseFloat(item.realisasi) || 0;
    const sisa = pagu - realisasi;
    const persentase = pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0;
    const status = persentase >= 80 ? "Sangat Baik" : persentase >= 50 ? "Optimal" : "Perlu Dorongan";

    // Bug #9 Fix: use max existing RO number instead of records.length to avoid duplicate IDs after deletions
    const existingNums = records
      .map(r => parseInt((r.id || '').replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const nextIdNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : records.length + 1;
    const idFormatted = `RO-${String(nextIdNum).padStart(3, '0')}`;

    const newRecord = {
      id: item.id || idFormatted,
      kode_program: item.kode_program || (item.bidang_bagian === "BagTUM" ? "WA.6163" : "BF.6161"),
      bidang_bagian: item.bidang_bagian || "BagTUM",
      kode_ro: item.kode_ro || "",
      nama_ro: item.nama_ro || "",
      pagu: pagu,
      realisasi: realisasi,
      sisa: sisa,
      persentase: persentase,
      status: status,
      date: item.date || new Date().toISOString().split("T")[0]
    };

    records.push(newRecord);
    saveToStorage();
    return newRecord;
  }

  function updateRecord(id, updatedFields) {
    const index = records.findIndex(r => r.id === id || r.kode_ro === id);
    if (index !== -1) {
      const pagu = updatedFields.pagu !== undefined ? parseFloat(updatedFields.pagu) : records[index].pagu;
      const realisasi = updatedFields.realisasi !== undefined ? parseFloat(updatedFields.realisasi) : records[index].realisasi;
      const sisa = pagu - realisasi;
      const persentase = pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0;
      const status = persentase >= 80 ? "Sangat Baik" : persentase >= 50 ? "Optimal" : "Perlu Dorongan";

      records[index] = {
        ...records[index],
        ...updatedFields,
        pagu: pagu,
        realisasi: realisasi,
        sisa: sisa,
        persentase: persentase,
        status: status,
        date: updatedFields.date || new Date().toISOString().split("T")[0]
      };
      saveToStorage();
      return records[index];
    }
    return null;
  }

  function deleteRecord(id) {
    const initialLen = records.length;
    records = records.filter(r => r.id !== id && r.kode_ro !== id);
    if (records.length !== initialLen) {
      saveToStorage();
      return true;
    }
    return false;
  }

  function getSummaryMetrics() {
    const totalRecords = records.length;
    const totalPagu = records.reduce((sum, r) => sum + (r.pagu || 0), 0);
    const totalRealisasi = records.reduce((sum, r) => sum + (r.realisasi || 0), 0);
    const totalSisa = totalPagu - totalRealisasi;
    const totalPct = totalPagu > 0 ? parseFloat(((totalRealisasi / totalPagu) * 100).toFixed(2)) : 0;

    const bidangTotals = {
      BagTUM: { pagu: 0, realisasi: 0, count: 0, name: "Bagian Tata Usaha dan Umum" },
      Doklan: { pagu: 0, realisasi: 0, count: 0, name: "Bidang Dokumen Perjalanan, Izin Tinggal & Status Keimigrasian" },
      Gakkum: { pagu: 0, realisasi: 0, count: 0, name: "Bidang Penegakan Hukum dan Kepatuhan Internal" }
    };

    records.forEach(r => {
      const b = r.bidang_bagian || "BagTUM";
      if (!bidangTotals[b]) {
        bidangTotals[b] = { pagu: 0, realisasi: 0, count: 0, name: b };
      }
      bidangTotals[b].pagu += (r.pagu || 0);
      bidangTotals[b].realisasi += (r.realisasi || 0);
      bidangTotals[b].count += 1;
    });

    Object.keys(bidangTotals).forEach(k => {
      const p = bidangTotals[k].pagu;
      const r = bidangTotals[k].realisasi;
      bidangTotals[k].sisa = p - r;
      bidangTotals[k].persentase = p > 0 ? parseFloat(((r / p) * 100).toFixed(2)) : 0;
    });

    return {
      totalRecords,
      totalPagu,
      totalRealisasi,
      totalSisa,
      totalPct,
      bidangTotals,
      sangatBaikCount: records.filter(r => r.persentase >= 80).length,
      optimalCount: records.filter(r => r.persentase >= 50 && r.persentase < 80).length,
      perluDoronganCount: records.filter(r => r.persentase < 50).length
    };
  }

  init();

  return {
    getAllRecords,
    setRecords,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord,
    getSummaryMetrics,
    DEFAULT_RECORDS
  };
})();
