const PDFDocument = require("pdfkit");
const { buildSummary } = require("../utils/summary");

const generatePdfBuffer = ({ title, chartImage, rows, summary }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text(title || "Data Report", { align: "left" });
    doc.moveDown();

    if (chartImage) {
      const imageBuffer = Buffer.from(chartImage.replace(/^data:image\/png;base64,/, ""), "base64");
      doc.image(imageBuffer, {
        fit: [500, 260],
        align: "center",
        valign: "center",
      });
      doc.moveDown();
    }

    doc.fontSize(12).text(summary || buildSummary(rows));
    doc.moveDown();

    doc.fontSize(14).text("Data Points", { underline: true });
    doc.moveDown(0.4);

    rows.forEach((row) => {
      doc.fontSize(11).text(`- ${row.label}: ${row.value}`);
    });

    doc.end();
  });

module.exports = {
  generatePdfBuffer,
};
