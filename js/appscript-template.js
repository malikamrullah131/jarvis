/**
 * Google Apps Script Code Generator for SIKAP AI Landing Page & Dashboard
 * Bug #15 Fix: Updated schema to match database.js RO structure (9 columns)
 */

window.APPS_SCRIPT_TEMPLATE = `/**
 * SIKAP AI Dashboard - Google Apps Script Web App Backend
 * Paste this script into your Google Sheet's Apps Script editor (Extensions > Apps Script)
 * Publish as Web App with Access: "Anyone"
 *
 * EXPECTED SHEET COLUMNS (Sheet1):
 * A: id | B: kode_program | C: bidang_bagian | D: kode_ro | E: nama_ro
 * F: pagu | G: realisasi | H: sisa | I: persentase | J: date
 */

// 1. Set your sheet tab name (default: "Sheet1")
var SHEET_NAME = "Sheet1";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return responseJSON({ status: "success", data: [] });
    }

    var result = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // skip empty rows
      var pagu = parseFloat(row[5]) || 0;
      var realisasi = parseFloat(row[6]) || 0;
      result.push({
        id: row[0] || ("RO-" + String(i).padStart(3, "0")),
        kode_program: row[1] || "",
        bidang_bagian: row[2] || "BagTUM",
        kode_ro: row[3] || "",
        nama_ro: row[4] || "Untitled RO",
        pagu: pagu,
        realisasi: realisasi,
        sisa: parseFloat(row[7]) || (pagu - realisasi),
        persentase: parseFloat(row[8]) || (pagu > 0 ? (realisasi / pagu) * 100 : 0),
        date: row[9] ? new Date(row[9]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      });
    }

    return responseJSON({ status: "success", count: result.length, data: result });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var payload = JSON.parse(e.postData.contents);

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["id", "kode_program", "bidang_bagian", "kode_ro", "nama_ro", "pagu", "realisasi", "sisa", "persentase", "date"]);
    }

    var action = payload.action || "add";
    var item = payload.item || payload;

    if (action === "add") {
      var pagu = parseFloat(item.pagu) || 0;
      var realisasi = parseFloat(item.realisasi) || 0;
      var sisa = item.sisa !== undefined ? parseFloat(item.sisa) : (pagu - realisasi);
      var persentase = item.persentase !== undefined ? parseFloat(item.persentase) : (pagu > 0 ? (realisasi / pagu) * 100 : 0);
      sheet.appendRow([
        item.id || "RO-NEW",
        item.kode_program || "",
        item.bidang_bagian || "BagTUM",
        item.kode_ro || "",
        item.nama_ro || "Baru",
        pagu,
        realisasi,
        sisa,
        parseFloat(persentase.toFixed(2)),
        item.date || new Date().toISOString().split("T")[0]
      ]);
      return responseJSON({ status: "success", message: "Record added to Google Sheet!", id: item.id });
    }

    if (action === "update") {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) {
          var pagu = parseFloat(item.pagu !== undefined ? item.pagu : data[i][5]) || 0;
          var realisasi = parseFloat(item.realisasi !== undefined ? item.realisasi : data[i][6]) || 0;
          sheet.getRange(i + 1, 2).setValue(item.kode_program || data[i][1]);
          sheet.getRange(i + 1, 3).setValue(item.bidang_bagian || data[i][2]);
          sheet.getRange(i + 1, 4).setValue(item.kode_ro || data[i][3]);
          sheet.getRange(i + 1, 5).setValue(item.nama_ro || data[i][4]);
          sheet.getRange(i + 1, 6).setValue(pagu);
          sheet.getRange(i + 1, 7).setValue(realisasi);
          sheet.getRange(i + 1, 8).setValue(pagu - realisasi);
          sheet.getRange(i + 1, 9).setValue(pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0);
          sheet.getRange(i + 1, 10).setValue(item.date || new Date().toISOString().split("T")[0]);
          return responseJSON({ status: "success", message: "Record updated in Google Sheet!" });
        }
      }
    }

    if (action === "delete") {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) {
          sheet.deleteRow(i + 1);
          return responseJSON({ status: "success", message: "Record deleted from Google Sheet!" });
        }
      }
    }

    return responseJSON({ status: "error", message: "Action or Item ID not found" });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function responseJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
