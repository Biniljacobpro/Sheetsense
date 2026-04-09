const express = require("express");
const pdfController = require("../controllers/pdfController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/pdf", authMiddleware, pdfController.createPdf);

module.exports = router;
