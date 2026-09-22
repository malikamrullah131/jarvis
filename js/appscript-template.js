/**
 * Google Apps Script Code Generator for SIKAP AI Landing Page & Dashboard
 */

window.APPS_SCRIPT_TEMPLATE = `/**
 * SIKAP AI Dashboard - Google Apps Script Web App Backend
 * Paste this script into your Google Sheet's Apps Script editor (Extensions > Apps Script)
 * Publish as Web App with Access: "Anyone"
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
    
    var headers = data[0];
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      result.push({
        id: row[0] || (i),
        title: row[1] || "Untitled Item",
        category: row[2] || "Analytics",
        value: parseFloat(row[3]) || 0,
        aiScore: row[4] || "+0.0%",
        status: row[5] || "Completed",
        date: row[6] ? new Date(row[6]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
      sheet.appendRow(["ID", "Title/Metric", "Category", "Value", "AI Calculation Result", "Status", "Updated Date"]);
    }
    
    var action = payload.action || "add"; // "add" or "update" or "delete"
    var item = payload.item || payload;
    
    if (action === "add") {
      var newId = item.id || "SKP-" + Math.floor(1000 + Math.random() * 9000);
      sheet.appendRow([
        newId,
        item.title || "New Calculation",
        item.category || "Analytics",
        item.value || 0,
        item.aiScore || "+10.0%",
        item.status || "Completed",
        new Date().toISOString().split('T')[0]
      ]);
      return responseJSON({ status: "success", message: "Record added to Google Sheet!", id: newId });
    }
    
    if (action === "update") {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) {
          sheet.getRange(i + 1, 2).setValue(item.title);
          sheet.getRange(i + 1, 3).setValue(item.category);
          sheet.getRange(i + 1, 4).setValue(item.value);
          sheet.getRange(i + 1, 5).setValue(item.aiScore);
          sheet.getRange(i + 1, 6).setValue(item.status);
          sheet.getRange(i + 1, 7).setValue(new Date().toISOString().split('T')[0]);
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
