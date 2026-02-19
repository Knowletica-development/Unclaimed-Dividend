import xlsx from "xlsx";
import path from "path";

let cachedData = null;

export const loadDividendData = () => {
  if (cachedData) return cachedData;

  const filePath = path.resolve("dividends.xlsx");
  const workbook = xlsx.readFile(filePath, { dense: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  cachedData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  return cachedData;
};

export const getDividendData = () => cachedData;
