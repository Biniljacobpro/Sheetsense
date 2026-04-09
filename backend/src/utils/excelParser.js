const XLSX = require("xlsx");

const parseBufferToRows = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

  const normalizedRows = rawRows
    .map((row) => ({
      label: String(row[0] ?? "").trim(),
      value: Number(row[1]),
    }))
    .filter((row) => row.label && Number.isFinite(row.value));

  return normalizedRows;
};

module.exports = {
  parseBufferToRows,
};
