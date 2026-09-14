import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const REFRESH_INTERVAL_MS = 5000;

export default function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [doc, setDoc] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const intervalRef = useRef(null);

  const fetchDetail = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      setError("");
      try {
        const [docRes, historyRes] = await Promise.all([
          api.get(`/documents/${documentId}`),
          api.get(`/documents/${documentId}/history`),
        ]);
        setDoc(docRes?.data?.data || null);
        setHistory(historyRes?.data?.data || []);
      } catch {
        setError("Unable to load document details.");
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [documentId]
  );

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (doc?.status === "PROCESSING") {
      intervalRef.current = setInterval(() => {
        fetchDetail(true);
      }, REFRESH_INTERVAL_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [doc?.status, fetchDetail]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/documents/${documentId}/download`);
      const url = res?.data?.data?.presignedUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        showToast("Download link is not available.", "error");
      }
    } catch {
      showToast("Unable to download document right now.", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <Loader label="Loading document..." />;
  }

  if (error || !doc) {
    return (
      <div className="page">
        <button className="btn btn-secondary" onClick={() => navigate("/documents")}>
          ← Back
        </button>
        <div className="empty-state">
          <p>{error || "Document not found."}</p>
        </div>
      </div>
    );
  }

  const result = doc.result;
  const validationErrors = doc.validationErrors;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate("/documents")}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? "Preparing..." : "Download"}
        </button>
      </div>

      <div className="detail-grid">
        <section className="detail-card">
          <h2>Document Info</h2>
          <dl className="detail-list">
            <dt>Filename</dt>
            <dd>{doc.filename}</dd>
            <dt>Document Type</dt>
            <dd>{(doc.documentType || "").replace(/_/g, " ")}</dd>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={doc.status} />
            </dd>
            <dt>Upload Date</dt>
            <dd>{doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "-"}</dd>
            <dt>Retry Count</dt>
            <dd>{doc.retryCount ?? 0}</dd>
          </dl>
        </section>

        {doc.status === "PROCESSED" && result && (
          <section className="detail-card">
            <h2>Extracted Result</h2>
            <dl className="detail-list">
              <dt>Company Name</dt>
              <dd>{result.companyName || "-"}</dd>
              <dt>Registration Number</dt>
              <dd>{result.registrationNumber || "-"}</dd>
              <dt>Address</dt>
              <dd>{result.address || "-"}</dd>
              <dt>Annual Revenue</dt>
              <dd>{result.annualRevenue || "-"}</dd>
              <dt>Document Date</dt>
              <dd>{result.documentDate || "-"}</dd>
            </dl>
          </section>
        )}

        {doc.status === "FAILED" &&
          validationErrors &&
          validationErrors.length > 0 && (
            <section className="detail-card">
              <h2>Validation Errors</h2>
              <ul className="validation-error-list">
                {validationErrors.map((ve, idx) => (
                  <li key={idx} className="validation-error-item">
                    <strong>{ve.field}:</strong> {ve.message}
                  </li>
                ))}
              </ul>
            </section>
          )}

        <section className="detail-card detail-card-wide">
          <h2>Processing History</h2>
          <Timeline history={history} />
        </section>
      </div>
    </div>
  );
}
