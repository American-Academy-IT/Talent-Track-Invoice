const XLSX = require('xlsx');
const { join } = require('path');

const parseXLSXFile = fileName => {
  const workbook = XLSX.readFile(join(__dirname, '..', 'assets', `${fileName}.xlsx`));
  const sheetName = workbook.SheetNames[0]; // Select the first sheet
  const sheet = workbook.Sheets[sheetName];
  const parsedData = XLSX.utils.sheet_to_json(sheet);
  return [...parsedData];
};

const BuildXLSXFile = data => {
  const workbook = XLSX.utils.book_new();

  const sheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

  const filePath = join(__dirname, '..', 'assets', 'output.xlsx');
  XLSX.writeFile(workbook, filePath);

  return filePath;
};

module.exports = {
  parseXLSXFile,
  BuildXLSXFile,
};
