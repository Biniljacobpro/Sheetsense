const FilterControls = ({ topN, setTopN, category, setCategory, chartType, setChartType }) => (
  <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
    <label className="text-sm text-slate-700">
      Show Top Items
      <input
        type="number"
        min="0"
        value={topN}
        onChange={(event) => setTopN(Number(event.target.value) || 0)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>

    <label className="text-sm text-slate-700">
      Category Filter
      <input
        type="text"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        placeholder="e.g. Jan"
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>

    <label className="text-sm text-slate-700">
      Chart Type
      <select
        value={chartType}
        onChange={(event) => setChartType(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>
    </label>
  </div>
);

export default FilterControls;
