const fileService = require("../services/fileService");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const result = await fileService.uploadAndParseFile({
      userId: req.user.id,
      file: req.file,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await fileService.listFilesForUser(req.user.id);
    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch files" });
  }
};

const getFileById = async (req, res) => {
  try {
    const fileId = Number(req.params.id);

    if (!Number.isInteger(fileId)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const result = await fileService.getFileWithData({
      fileId,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch file details" });
  }
};

const renameFile = async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    const filename = String(req.body.filename || "").trim();

    if (!Number.isInteger(fileId)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const updatedFile = await fileService.renameFileForUser({
      fileId,
      userId: req.user.id,
      filename,
    });

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ file: updatedFile });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to rename file" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const fileId = Number(req.params.id);

    if (!Number.isInteger(fileId)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const deleted = await fileService.deleteFileForUser({
      fileId,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ message: "File deleted" });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to delete file" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFileById,
  renameFile,
  deleteFile,
};
