import { useRef } from "react";

const UploadArea = ({ onFileSelected, isLoading }) => {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      onFileSelected(droppedFile);
    }
  };

  return (
    <div
      className="rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/60 p-8 text-center"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="font-serif text-2xl text-slate-900">Upload CSV or XLSX</h2>
      <p className="mt-2 text-slate-600">Drag and drop a file, or browse manually.</p>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        className="mt-5 rounded-full bg-teal-600 px-5 py-2 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Choose File"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={(event) => {
          const pickedFile = event.target.files?.[0];
          if (pickedFile) {
            onFileSelected(pickedFile);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default UploadArea;
