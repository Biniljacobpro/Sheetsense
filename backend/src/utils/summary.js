const buildSummary = (rows) => {
  if (!rows || rows.length === 0) {
    return "This report was generated from an uploaded dataset, but no valid rows were found.";
  }

  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return `This report shows trends based on the uploaded dataset. The highest value is ${highest.value} (${highest.label}) and the lowest is ${lowest.value} (${lowest.label}).`;
};

module.exports = {
  buildSummary,
};
