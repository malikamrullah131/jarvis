/**
 * ==============================================================================
 * SIKAP AI DASHBOARD - GOOGLE APPS SCRIPT BACKEND (REALTIME DATABASE)
 * ==============================================================================
 * Spreadsheet ID: 1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0
 * 
 * CARA MEMASANG / DEPLOY (1 KLIK):
 * 1. Buka Google Sheet Anda: https://docs.google.com/spreadsheets/d/1qx2cY3-fzDnQEK5OnvxdP9ntDHxMVUBbVcQE4b292m0/edit
 * 2. Klik menu "Ekstensi" > "Apps Script" (Extensions > Apps Script)
 * 3. Hapus semua kode bawaan, lalu Salin & Tempel seluruh kode di bawah ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Klik tombol "Terapkan" > "Terapkan sebagai Aplikasi Web" (Deploy > New Deployment).
 * 6. Pilih Jenis: "Aplikasi Web" (Web App).
 * 7. Setel "Jalankan sebagai": Saya (Me).
 * 8. Setel "Siapa yang memiliki akses": Siapa Saja (Anyone).
 * 9. Klik "Terapkan" (Deploy), lalu salin URL Web App yang dihasilkan!
 * ==============================================================================
 */

var SHEET_NAME = "Sheet1";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return responseJSON({ status: "success", count: 0, data: [] });
    }
    
    var headers = data[0];
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[3]) continue; // Skip empty rows
      
      result.push({
        id: row[0] || ("RO-" + i),
        kode_program: row[1] || "",
        bidang_bagian: row[2] || "BagTUM",
        kode_ro: row[3] || "",
        nama_ro: row[4] || "",
        pagu: parseAmount(row[5]),
        realisasi: parseAmount(row[6]),
        sisa: parseAmount(row[7]),
        persentase: parsePercentage(row[8], row[5], row[6])
      });
    }
    
    return responseJSON({
      status: "success",
      count: result.length,
      updated_at: new Date().toISOString(),
      data: result
    });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var payload = JSON.parse(e.postData.contents);
    
    var action = payload.action || "add";
    var item = payload.item || payload;
    
    if (action === "add" || action === "update") {
      var rowData = [
        item.id || ("RO-" + Date.now()),
        item.kode_program || "WA.6163",
        item.bidang_bagian || "BagTUM",
        item.kode_ro || "",
        item.nama_ro || "",
        item.pagu || 0,
        item.realisasi || 0,
        (item.pagu || 0) - (item.realisasi || 0),
        item.pagu ? ((item.realisasi / item.pagu) * 100).toFixed(2) + "%" : "0%"
      ];
      
      if (action === "update" && item.id) {
        var data = sheet.getDataRange().getValues();
        var rowIndex = -1;
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] == item.id || data[i][3] == item.kode_ro) {
            rowIndex = i + 1;
            break;
          }
        }
        if (rowIndex > 0) {
          sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
          return responseJSON({ status: "success", action: "updated", item: item });
        }
      }
      
      sheet.appendRow(rowData);
      return responseJSON({ status: "success", action: "added", item: item });
    }
    
    return responseJSON({ status: "error", message: "Invalid action" });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function parseAmount(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  var str = val.toString().replace(/Rp|\s/gi, '').replace(/\./g, '').replace(',', '.').trim();
  var num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function parsePercentage(val, pagu, realisasi) {
  if (typeof val === 'number') return val;
  if (val) {
    var str = val.toString().replace(/%|\s/gi, '').replace(',', '.').trim();
    var num = parseFloat(str);
    if (!isNaN(num)) return num;
  }
  var p = parseAmount(pagu);
  var r = parseAmount(realisasi);
  return p > 0 ? (r / p) * 100 : 0;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
