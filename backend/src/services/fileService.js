const db = require("../config/db");
const fileModel = require("../models/fileModel");
const dataModel = require("../models/dataModel");
const { parseBufferToRows } = require("../utils/excelParser");

const uploadAndParseFile = async ({ userId, file }) => {
  const parsedRows = parseBufferToRows(file.buffer);

  if (parsedRows.length === 0) {
    throw new Error("No valid rows found. Ensure column A has labels and column B has numeric values.");
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const fileInsert = await client.query(
      "INSERT INTO files (user_id, filename) VALUES ($1, $2) RETURNING id, filename, uploaded_at",
      [userId, file.originalname],
    );
    const fileRecord = fileInsert.rows[0];

    const placeholders = parsedRows
      .map((_row, index) => {
        const base = index * 3;
        return `($${base + 1}, $${base + 2}, $${base + 3})`;
      })
      .join(",");
    const values = parsedRows.flatMap((row) => [fileRecord.id, row.label, row.value]);

    await client.query(
      `INSERT INTO data (file_id, label, value) VALUES ${placeholders}`,
      values,
    );

    await client.query("COMMIT");

    return {
      file: fileRecord,
      rows: parsedRows,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const listFilesForUser = async (userId) => fileModel.getFilesByUser(userId);

const getFileWithData = async ({ fileId, userId }) => {
  const file = await fileModel.getFileByIdForUser({ fileId, userId });

  if (!file) {
    return null;
  }

  const rows = await dataModel.getDataByFileId(file.id);

  return {
    file,
    rows,
  };
};

const renameFileForUser = async ({ fileId, userId, filename }) => {
  return fileModel.updateFilenameForUser({ fileId, userId, filename });
};

const deleteFileForUser = async ({ fileId, userId }) => {
  return fileModel.deleteFileForUser({ fileId, userId });
};

module.exports = {
  uploadAndParseFile,
  listFilesForUser,
  getFileWithData,
  renameFileForUser,
  deleteFileForUser,
};
