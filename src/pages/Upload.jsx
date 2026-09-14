import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useToast } from "../context/ToastContext";

const DOC_TYPE_OPTIONS = [
  "FINANCIAL_STATEMENT",
  "INSURANCE_POLICY",
  "LEGAL_CONTRACT",
  "TAX_DOCUMENT",
  "OTHER",
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState(DOC_TYPE_OPTIONS[0]);
  const [metadata, setMetadata] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    if (metadata.trim()) {
      try {
        JSON.parse(metadata);
      } catch {
        setError("Metadata must be valid JSON.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    if (metadata.trim()) {
      formData.append("metadata", metadata.trim());
    }

    setUploading(true);
    setProgress(0);
    try {
      await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
      showToast("Document uploaded successfully.", "success");
      navigate("/documents");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Upload failed. Please check the file and try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upload Document</h1>
      </div>

      <div className="upload-card">
        <form onSubmit={handleSubmit} className="upload-form">
          <label className="form-label">
            File
            <input
              type="file"
              className="form-input"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>

          <label className="form-label">
            Document Type
            <select
              className="form-select"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              {DOC_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Metadata (optional JSON)
            <textarea
              className="form-textarea"
              rows={5}
              placeholder='{"key": "value"}'
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          {uploading && (
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <span className="progress-label">{progress}%</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/documents")}
              disabled={uploading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
