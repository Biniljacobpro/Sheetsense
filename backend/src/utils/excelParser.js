const XLSX = require("xlsx");

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

const toNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();

    if (!normalized) {
      return NaN;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
};

const parseBufferToRows = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

  const nonEmptyRows = rawRows.filter((row) => row.some((cell) => !isBlank(cell)));

  if (nonEmptyRows.length === 0) {
    return [];
  }

  const headerRow = nonEmptyRows[0];
  const headerNumericCount = headerRow.filter((cell) => Number.isFinite(toNumber(cell))).length;
  const headerTextCount = headerRow.filter(
    (cell) => !isBlank(cell) && !Number.isFinite(toNumber(cell)),
  ).length;

  const hasHeader = headerTextCount > 0 && headerNumericCount === 0;
  const dataRows = hasHeader ? nonEmptyRows.slice(1) : nonEmptyRows;

  const normalizedRows = [];

  dataRows.forEach((row, rowIndex) => {
    let baseLabel = "";
    const numericCells = [];

    row.forEach((cell, cellIndex) => {
      const num = toNumber(cell);

      if (Number.isFinite(num)) {
        numericCells.push({ cellIndex, value: num });
        return;
      }

      const trimmed = String(cell).trim();
      if (!baseLabel && trimmed) {
        baseLabel = trimmed;
      }
    });

    if (numericCells.length === 0) {
      return;
    }

    const fallbackLabel = `Row ${rowIndex + 1}`;
    const labelPrefix = baseLabel || fallbackLabel;

    if (numericCells.length === 1) {
      normalizedRows.push({ label: labelPrefix, value: numericCells[0].value });
      return;
    }

    numericCells.forEach((cell, metricIndex) => {
      const metricName = hasHeader
        ? String(headerRow[cell.cellIndex] || "").trim() || `Metric ${metricIndex + 1}`
        : `Metric ${metricIndex + 1}`;

      normalizedRows.push({
        label: `${labelPrefix} - ${metricName}`,
        value: cell.value,
      });
    });
  });

  return normalizedRows;
};

module.exports = {
  parseBufferToRows,
};
