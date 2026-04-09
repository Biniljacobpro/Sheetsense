const multer = require("multer");

const allowedMimeTypes = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const allowedExtensions = new Set([".csv", ".xlsx"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const filename = String(file.originalname || "").toLowerCase();
    const hasAllowedExtension = [...allowedExtensions].some((extension) =>
      filename.endsWith(extension),
    );

    const hasAllowedMime = allowedMimeTypes.has(file.mimetype);

    if (!hasAllowedMime && !hasAllowedExtension) {
      cb(new Error("Only CSV and XLSX files are allowed"));
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
