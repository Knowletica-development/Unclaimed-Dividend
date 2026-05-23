import xlsx from "xlsx";
import path from "path";

let cachedCawasjiData = null;

export const loadCawasjiData = () => {
  if (cachedCawasjiData) return cachedCawasjiData;

  const filePath = path.resolve("Cawasji Nusserwanji Patuck.xlsx");
  const workbook = xlsx.readFile(filePath, { dense: true });

  const sheetName = workbook.SheetNames.find(name => name.trim() === "List") || workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData = xlsx.utils.sheet_to_json(sheet, { 
    defval: "",
    range: 0 
  });
  
  const cleanedData = [];

  for (let row of rawData) {
    const cleanedRow = {};
    let hasActualData = false;

    Object.keys(row).forEach((key) => {
      const trimmedKey = key.trim();
      
      if (trimmedKey.startsWith("__EMPTY") || trimmedKey === "") {
        return;
      }

      const val = typeof row[key] === "string" ? row[key].trim() : row[key];
      cleanedRow[trimmedKey] = val;

      if (val !== "" && trimmedKey !== "Aadhar Number" && trimmedKey !== "Aadhar Number" && trimmedKey !== "Date of Birth") {
        if (trimmedKey === "Investor First Name" || trimmedKey === "Folio Number" || trimmedKey === "Unit" || trimmedKey === "Address") {
          hasActualData = true;
        }
      }
    });

    if (hasActualData) {
      cleanedData.push(cleanedRow);
    }
  }

  cachedCawasjiData = cleanedData;

  return cachedCawasjiData;
};

export const getCawasjiData = () => cachedCawasjiData;