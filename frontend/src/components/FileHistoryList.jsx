import { Link } from "react-router-dom";
import { useState } from "react";

const FileHistoryList = ({ files, onRename, onDelete, isBusy }) => {
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [pendingDeleteFile, setPendingDeleteFile] = useState(null);

  if (!files.length) {
    return <p className="text-sm text-slate-600">No uploads yet. Start by uploading a file.</p>;
  }

  const startEditing = (file) => {
    setEditingId(file.id);
    setDraftName(file.filename);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveName = async (fileId) => {
    const trimmedName = draftName.trim();

    if (!trimmedName) {
      return;
    }

    await onRename({ id: fileId, filename: trimmedName });
    cancelEditing();
  };

  const confirmDelete = async () => {
    if (!pendingDeleteFile) {
      return;
    }

    await onDelete(pendingDeleteFile.id);
    setPendingDeleteFile(null);
  };

  return (
    <>
      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-[220px] flex-1">
                {editingId === file.id ? (
                  <input
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    disabled={isBusy}
                  />
                ) : (
                  <p className="font-medium text-slate-900">{file.filename}</p>
                )}
                <p className="text-sm text-slate-500">
                  {new Date(file.uploaded_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/chart/${file.id}`}
                  className="rounded-full border border-slate-300 px-4 py-1.5 text-sm transition hover:bg-slate-100"
                >
                  Open
                </Link>

                {editingId === file.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveName(file.id)}
                      disabled={isBusy}
                      className="rounded-full border border-teal-300 px-4 py-1.5 text-sm text-teal-700 transition hover:bg-teal-50 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={isBusy}
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-sm transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(file)}
                    disabled={isBusy}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-sm transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Rename
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPendingDeleteFile(file)}
                  disabled={isBusy}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {pendingDeleteFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-2xl text-slate-900">Delete file?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{pendingDeleteFile.filename}</span>? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteFile(null)}
                disabled={isBusy}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isBusy}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                {isBusy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileHistoryList;
