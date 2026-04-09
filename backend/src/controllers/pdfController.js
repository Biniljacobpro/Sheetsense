const { generatePdfBuffer } = require("../services/pdfService");

const createPdf = async (req, res) => {
  try {
    const { title, chartImage, rows, summary } = req.body;

    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ message: "Rows are required" });
    }

    const pdfBuffer = await generatePdfBuffer({
      title,
      chartImage,
      rows,
      summary,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};

module.exports = {
  createPdf,
};
