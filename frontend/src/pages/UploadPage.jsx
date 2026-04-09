import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadArea from "../components/UploadArea";
import { uploadFile } from "../services/fileService";

const UploadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelected = async (file) => {
    setError("");
    setIsLoading(true);

    try {
      const data = await uploadFile(file);
      navigate(`/chart/${data.file.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "File upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-8">
      <h1 className="font-serif text-4xl text-slate-900">Upload Data File</h1>
      <p className="text-slate-600">
        Best format: column A = label and column B = value, but multiple numeric columns are also supported.
      </p>

      <UploadArea onFileSelected={handleFileSelected} isLoading={isLoading} />

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
};

export default UploadPage;
