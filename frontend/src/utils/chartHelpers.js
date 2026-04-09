export const sanitizeChartRows = (rows = []) =>
  rows
    .map((row) => ({
      ...row,
      value: Number(row.value),
      label: String(row.label || "").trim(),
    }))
    .filter((row) => row.label && Number.isFinite(row.value));

export const applyFilters = (rows, { topN, category }) => {
  let nextRows = [...rows];

  if (category) {
    nextRows = nextRows.filter((row) =>
      row.label.toLowerCase().includes(category.toLowerCase()),
    );
  }

  if (topN > 0) {
    nextRows = [...nextRows]
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }

  return nextRows;
};
