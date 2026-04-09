import html2canvas from "html2canvas";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChartCard from "../components/ChartCard";
import FilterControls from "../components/FilterControls";
import { getFileById, renameFile } from "../services/fileService";
import { generatePdf } from "../services/pdfService";
import { applyFilters, sanitizeChartRows } from "../utils/chartHelpers";

const ChartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [draftFileName, setDraftFileName] = useState("");
  const [error, setError] = useState("");

  const [chartType, setChartType] = useState("bar");
  const [topN, setTopN] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadFile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getFileById(id);
        setFile(data.file);
        setDraftFileName(data.file?.filename || "");
        setRows(sanitizeChartRows(data.rows));
      } catch (_error) {
        setError("Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [id]);

  const filteredRows = useMemo(
    () => applyFilters(rows, { topN, category }),
    [rows, topN, category],
  );

  const handleGeneratePdf = async () => {
    if (!chartRef.current) {
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(chartRef.current, { backgroundColor: "#ffffff" });
      const chartImage = canvas.toDataURL("image/png");

      const blob = await generatePdf({
        title: `Report for ${file?.filename || "Uploaded File"}`,
        chartImage,
        rows: filteredRows,
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "report.pdf";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      setError("Failed to generate PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveName = async () => {
    const trimmedName = draftFileName.trim();

    if (!trimmedName) {
      setError("Filename cannot be empty");
      return;
    }

    try {
      setError("");
      setIsSavingName(true);
      const data = await renameFile({ id: file.id, filename: trimmedName });
      setFile((prev) => ({ ...prev, filename: data.file.filename }));
      setDraftFileName(data.file.filename);
      setIsRenaming(false);
    } catch (_error) {
      setError("Failed to rename file");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelRename = () => {
    setDraftFileName(file?.filename || "");
    setIsRenaming(false);
  };

  if (isLoading) {
    return <div className="p-8 text-slate-600">Loading chart...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-2 inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>
          <h1 className="font-serif text-3xl text-slate-900">Chart View</h1>
          {isRenaming ? (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                value={draftFileName}
                onChange={(event) => setDraftFileName(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                disabled={isSavingName}
              />
              <button
                type="button"
                onClick={handleSaveName}
                disabled={isSavingName}
                className="rounded-full border border-teal-300 px-3 py-1 text-xs font-medium text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
              >
                {isSavingName ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancelRename}
                disabled={isSavingName}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-slate-600">{file?.filename}</p>
              <button
                type="button"
                onClick={() => setIsRenaming(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                aria-label="Edit filename"
                title="Edit filename"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf || filteredRows.length === 0}
          className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      <FilterControls
        topN={topN}
        setTopN={setTopN}
        category={category}
        setCategory={setCategory}
        chartType={chartType}
        setChartType={setChartType}
      />

      <div ref={chartRef} className="rounded-2xl bg-white p-3">
        <ChartCard data={filteredRows} type={chartType} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ChartPage;
