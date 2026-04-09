const db = require("../config/db");

const insertDataRows = async ({ fileId, rows }) => {
  if (rows.length === 0) {
    return;
  }

  const placeholders = rows
    .map((_row, index) => {
      const base = index * 3;
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(",");

  const values = rows.flatMap((row) => [fileId, row.label, row.value]);

  await db.query(
    `INSERT INTO data (file_id, label, value) VALUES ${placeholders}`,
    values,
  );
};

const getDataByFileId = async (fileId) => {
  const result = await db.query(
    "SELECT id, label, value FROM data WHERE file_id = $1 ORDER BY id ASC",
    [fileId],
  );

  return result.rows;
};

module.exports = {
  insertDataRows,
  getDataByFileId,
};
