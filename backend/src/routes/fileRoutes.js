const express = require("express");
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), fileController.uploadFile);
router.get("/files", authMiddleware, fileController.getFiles);
router.get("/files/:id", authMiddleware, fileController.getFileById);
router.patch("/files/:id", authMiddleware, fileController.renameFile);
router.delete("/files/:id", authMiddleware, fileController.deleteFile);

module.exports = router;
