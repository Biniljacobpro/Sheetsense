const express = require("express");
const authRoutes = require("./authRoutes");
const fileRoutes = require("./fileRoutes");
const pdfRoutes = require("./pdfRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/", fileRoutes);
router.use("/", pdfRoutes);

module.exports = router;
