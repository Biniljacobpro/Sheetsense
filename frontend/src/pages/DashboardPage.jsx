import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FileHistoryList from "../components/FileHistoryList";
import { deleteFile, getFiles, renameFile } from "../services/fileService";

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await getFiles();
        setFiles(data.files || []);
      } catch (_error) {
        setError("Could not load your file history.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleRename = async ({ id, filename }) => {
    setError("");
    setIsBusy(true);

    try {
      const data = await renameFile({ id, filename });
      setFiles((prevFiles) =>
        prevFiles.map((file) => (file.id === id ? { ...file, filename: data.file.filename } : file)),
      );
    } catch (_error) {
      setError("Could not rename this file.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setIsBusy(true);

    try {
      await deleteFile(id);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (_error) {
      setError("Could not delete this file.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-700 p-8 text-white shadow-lg">
        <h1 className="font-serif text-4xl">Data Upload Dashboard</h1>
        <p className="mt-3 max-w-2xl text-cyan-50">
          Upload datasets, explore chart insights, and export polished PDF reports.
        </p>
        <Link
          to="/upload"
          className="mt-5 inline-block rounded-full bg-white px-5 py-2 font-medium text-teal-800"
        >
          Upload New File
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-serif text-2xl text-slate-900">Upload History</h2>
        <div className="mt-4">
          {isLoading && <p className="text-sm text-slate-600">Loading history...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!isLoading && !error && (
            <FileHistoryList
              files={files}
              onRename={handleRename}
              onDelete={handleDelete}
              isBusy={isBusy}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
