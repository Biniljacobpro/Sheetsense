const PDFDocument = require("pdfkit");
const PAGE_MARGIN = 50;
const CONTENT_WIDTH = 495;

const SECTION_HEADER_SIZE = 15;
const BODY_SIZE = 11;

const sanitizeRows = (rows = []) =>
  rows
    .map((row) => ({
      label: String(row.label || "").trim(),
      value: Number(row.value),
    }))
    .filter((row) => row.label && Number.isFinite(row.value));

const ensureSpace = (doc, requiredHeight) => {
  const bottomLimit = doc.page.height - PAGE_MARGIN;

  if (doc.y + requiredHeight > bottomLimit) {
    doc.addPage();
  }
};

const drawSectionDivider = (doc) => {
  ensureSpace(doc, 20);
  const y = doc.y + 2;
  doc
    .moveTo(PAGE_MARGIN, y)
    .lineTo(doc.page.width - PAGE_MARGIN, y)
    .lineWidth(0.7)
    .strokeColor("#d5dce4")
    .stroke();
  doc.moveDown(1.2);
};

const extractFileName = (title) => {
  if (!title) {
    return "Uploaded Dataset";
  }

  return String(title).replace(/^Report for\s*/i, "").trim() || "Uploaded Dataset";
};

const getInsights = (rows) => {
  if (!rows.length) {
    return {
      highest: null,
      lowest: null,
      average: 0,
      totalEntries: 0,
      totalValue: 0,
    };
  }

  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const totalValue = rows.reduce((sum, row) => sum + row.value, 0);

  return {
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
    average: totalValue / rows.length,
    totalEntries: rows.length,
    totalValue,
  };
};

const addHeader = (doc, { fileName, generatedDate }) => {
  doc.font("Helvetica-Bold").fontSize(22).fillColor("#0f172a").text("Data Analysis Report", {
    align: "center",
  });

  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(BODY_SIZE).fillColor("#475569");
  doc.text(`File: ${fileName}`, { align: "center" });
  doc.text(`Generated: ${generatedDate}`, { align: "center" });
  doc.moveDown(1.3);
};

const addChart = (doc, chartImage) => {
  doc.font("Helvetica-Bold").fontSize(SECTION_HEADER_SIZE).fillColor("#0f172a").text("Chart", {
    align: "left",
  });
  doc.moveDown(0.5);

  if (!chartImage) {
    doc.font("Helvetica").fontSize(BODY_SIZE).fillColor("#64748b").text("No chart image provided.");
    doc.moveDown(1);
    return;
  }

  const imageBuffer = Buffer.from(chartImage.replace(/^data:image\/png;base64,/, ""), "base64");
  ensureSpace(doc, 280);

  doc.image(imageBuffer, {
    fit: [CONTENT_WIDTH, 230],
    align: "center",
    valign: "center",
  });

  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(10).fillColor("#64748b").text("Figure 1: Data Visualization", {
    align: "center",
  });
  doc.moveDown(1.1);
};

const addInsights = (doc, insights) => {
  ensureSpace(doc, 140);

  doc.font("Helvetica-Bold").fontSize(SECTION_HEADER_SIZE).fillColor("#0f172a").text("Key Insights", {
    align: "left",
  });
  doc.moveDown(0.45);

  const highestText = insights.highest
    ? `Highest Value: ${insights.highest.value} (${insights.highest.label})`
    : "Highest Value: N/A";
  const lowestText = insights.lowest
    ? `Lowest Value: ${insights.lowest.value} (${insights.lowest.label})`
    : "Lowest Value: N/A";
  const avgText = `Average Value: ${insights.average.toFixed(2)}`;
  const totalText = `Total Entries: ${insights.totalEntries}`;

  [highestText, lowestText, avgText, totalText].forEach((line) => {
    ensureSpace(doc, 18);
    doc
      .font("Helvetica")
      .fontSize(BODY_SIZE)
      .fillColor("#334155")
      .text(`• ${line}`, { continued: false });
    doc.moveDown(0.2);
  });

  doc.moveDown(0.7);
};

const buildConclusion = (rows, insights) => {
  if (!rows.length || !insights.highest || !insights.lowest) {
    return "The uploaded dataset did not contain enough valid numeric entries to infer a reliable trend. Please upload a richer dataset for deeper analysis.";
  }

  const first = rows[0].value;
  const last = rows[rows.length - 1].value;
  const change = last - first;

  const positiveTransitions = rows.slice(1).filter((row, index) => row.value > rows[index].value).length;
  const negativeTransitions = rows.slice(1).filter((row, index) => row.value < rows[index].value).length;

  let trendLabel = "mixed movement";

  if (change > 0 && positiveTransitions >= negativeTransitions) {
    trendLabel = "a generally upward trend";
  } else if (change < 0 && negativeTransitions >= positiveTransitions) {
    trendLabel = "a generally downward trend";
  }

  return `The dataset shows ${trendLabel} across the observed entries. The peak value appears at ${insights.highest.label} with ${insights.highest.value}, while the lowest value is at ${insights.lowest.label} with ${insights.lowest.value}. Overall, the average value of ${insights.average.toFixed(2)} suggests a ${change >= 0 ? "stable-to-growing" : "softening"} performance pattern.`;
};

const addConclusion = (doc, conclusionText) => {
  ensureSpace(doc, 120);

  doc.font("Helvetica-Bold").fontSize(SECTION_HEADER_SIZE).fillColor("#0f172a").text("Conclusion", {
    align: "left",
  });
  doc.moveDown(0.45);

  doc.font("Helvetica").fontSize(BODY_SIZE).fillColor("#334155").text(conclusionText, {
    align: "left",
    lineGap: 3,
  });

  doc.moveDown(0.8);
};

const drawTableHeader = (doc, y, labelX, valueX, tableWidth) => {
  doc
    .rect(PAGE_MARGIN, y, tableWidth, 24)
    .fillAndStroke("#f1f5f9", "#d5dce4");

  doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a");
  doc.text("Label", labelX, y + 7, { width: valueX - labelX - 10 });
  doc.text("Value", valueX, y + 7, { width: 90, align: "right" });
};

const drawTableRow = (doc, row, y, labelX, valueX, tableWidth, index) => {
  const rowHeight = 22;
  if (index % 2 === 0) {
    doc.rect(PAGE_MARGIN, y, tableWidth, rowHeight).fill("#ffffff");
  } else {
    doc.rect(PAGE_MARGIN, y, tableWidth, rowHeight).fill("#f8fafc");
  }

  doc.rect(PAGE_MARGIN, y, tableWidth, rowHeight).strokeColor("#e2e8f0").lineWidth(0.5).stroke();

  doc.font("Helvetica").fontSize(10).fillColor("#334155");
  doc.text(row.label, labelX, y + 6, {
    width: valueX - labelX - 10,
    ellipsis: true,
  });
  doc.text(Number(row.value).toFixed(2), valueX, y + 6, { width: 90, align: "right" });
};

const addTable = (doc, rows) => {
  const tableWidth = CONTENT_WIDTH;
  const labelX = PAGE_MARGIN + 10;
  const valueX = PAGE_MARGIN + tableWidth - 95;
  const tableTopPadding = 32;
  const rowHeight = 22;

  ensureSpace(doc, 120);
  doc.font("Helvetica-Bold").fontSize(SECTION_HEADER_SIZE).fillColor("#0f172a").text("Data Table", {
    align: "left",
  });
  doc.moveDown(0.5);

  let y = doc.y;
  drawTableHeader(doc, y, labelX, valueX, tableWidth);
  y += tableTopPadding;

  rows.forEach((row, index) => {
    const minimumNeeded = rowHeight + 25;
    if (y + minimumNeeded > doc.page.height - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
      drawTableHeader(doc, y, labelX, valueX, tableWidth);
      y += tableTopPadding;
    }

    drawTableRow(doc, row, y, labelX, valueX, tableWidth, index);
    y += rowHeight;
  });

  doc.y = y + 8;
};

const addPageNumbers = (doc) => {
  const range = doc.bufferedPageRange();

  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(i);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#94a3b8")
      .text(`Page ${i + 1} of ${range.count}`, PAGE_MARGIN, doc.page.height - 28, {
        width: doc.page.width - PAGE_MARGIN * 2,
        align: "center",
      });
  }
};

const generatePdfBuffer = ({ title, chartImage, rows }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE_MARGIN,
      bufferPages: true,
      info: {
        Title: "Data Analysis Report",
      },
    });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const normalizedRows = sanitizeRows(rows);
    const fileName = extractFileName(title);
    const generatedDate = new Date().toLocaleString();
    const insights = getInsights(normalizedRows);
    const conclusion = buildConclusion(normalizedRows, insights);

    addHeader(doc, { fileName, generatedDate });
    drawSectionDivider(doc);

    addChart(doc, chartImage);
    drawSectionDivider(doc);

    addInsights(doc, insights);
    drawSectionDivider(doc);

    addConclusion(doc, conclusion);
    drawSectionDivider(doc);

    addTable(doc, normalizedRows);

    addPageNumbers(doc);
    doc.end();
  });

module.exports = {
  generatePdfBuffer,
};
