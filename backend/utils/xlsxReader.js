import xlsx from "xlsx";
import path from "path";
import ErrorHandler from "./ErrorHandler.js";

export const readXLSXFile = () => {
  const filePath = path.join(process.cwd(), "dividends.xlsx");

  try {
    const workbook = xlsx.readFile(filePath, { cellDates: true });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new ErrorHandler("XLSX sheet not found", 400);
    }

    const sheet = workbook.Sheets[sheetName];

    return xlsx.utils.sheet_to_json(sheet, { defval: "" });
  } catch (error) {
    console.error(error);
    throw new ErrorHandler("Failed to read XLSX file", 500);
  }
};
