function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function handleResponse(e) {
  var sheet = SpreadsheetApp.openById("17hCBUrP5pf7JFauSO97bqNwvxw1h45GTKFIPbyA4Fb8").getSheetByName("Sheet1");

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [new Date()];
  for (var i = 0; i < headers.length; i++) {
    row.push(e.parameter[headers[i]]);
  }
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({"result": "success", "row": row}))
    .setMimeType(ContentService.MimeType.JSON);
}
