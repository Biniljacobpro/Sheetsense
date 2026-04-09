const db = require("../config/db");

const createFileRecord = async ({ userId, filename }) => {
  const result = await db.query(
    "INSERT INTO files (user_id, filename) VALUES ($1, $2) RETURNING id, user_id, filename, uploaded_at",
    [userId, filename],
  );

  return result.rows[0];
};

const getFilesByUser = async (userId) => {
  const result = await db.query(
    "SELECT id, filename, uploaded_at FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC",
    [userId],
  );

  return result.rows;
};

const getFileByIdForUser = async ({ fileId, userId }) => {
  const result = await db.query(
    "SELECT id, filename, uploaded_at FROM files WHERE id = $1 AND user_id = $2",
    [fileId, userId],
  );

  return result.rows[0] || null;
};

const updateFilenameForUser = async ({ fileId, userId, filename }) => {
  const result = await db.query(
    "UPDATE files SET filename = $1 WHERE id = $2 AND user_id = $3 RETURNING id, filename, uploaded_at",
    [filename, fileId, userId],
  );

  return result.rows[0] || null;
};

const deleteFileForUser = async ({ fileId, userId }) => {
  const result = await db.query(
    "DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING id",
    [fileId, userId],
  );

  return Boolean(result.rows[0]);
};

module.exports = {
  createFileRecord,
  getFilesByUser,
  getFileByIdForUser,
  updateFilenameForUser,
  deleteFileForUser,
};
