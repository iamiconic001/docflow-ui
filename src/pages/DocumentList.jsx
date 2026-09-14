import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { TableSkeleton } from "../components/Loader";

const STATUS_OPTIONS = ["UPLOADED", "PROCESSING", "PROCESSED", "FAILED"];
const DOC_TYPE_OPTIONS = [
  "FINANCIAL_STATEMENT",
  "INSURANCE_POLICY",
  "LEGAL_CONTRACT",
  "TAX_DOCUMENT",
  "OTHER",
];
const PAGE_SIZE = 10;
const REFRESH_INTERVAL_MS = 10000;

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const fetchDocuments = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      setError("");
      try {
        const params = { page, size: PAGE_SIZE };
        if (statusFilter) params.status = statusFilter;
        if (typeFilter) params.documentType = typeFilter;

        const res = await api.get("/documents", { params });
        const data = res?.data?.data || {};
        setDocuments(data.content || []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      } catch {
        setError("Unable to load documents right now. Please try again.");
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [page, statusFilter, typeFilter]
  );

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchDocuments(true);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchDocuments]);

  const stats = {
    total: totalElements,
    processing: documents.filter((d) => d.status === "PROCESSING").length,
    processed: documents.filter((d) => d.status === "PROCESSED").length,
    failed: documents.filter((d) => d.status === "FAILED").length,
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(0);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Documents</h1>
        <button className="btn btn-primary" onClick={() => navigate("/upload")}>
          Upload Document
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Documents" value={stats.total} color="#2563eb" />
        <StatCard label="Processing" value={stats.processing} color="#d97706" />
        <StatCard label="Processed" value={stats.processed} color="#16a34a" />
        <StatCard label="Failed" value={stats.failed} color="#dc2626" />
      </div>

      <div className="filters-bar">
        <select
          className="form-select"
          value={statusFilter}
          onChange={handleFilterChange(setStatusFilter)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={typeFilter}
          onChange={handleFilterChange(setTypeFilter)}
        >
          <option value="">All Document Types</option>
          {DOC_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={PAGE_SIZE} cols={5} />
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => fetchDocuments()}>
            Retry
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <p>No documents found.</p>
          <button className="btn btn-primary" onClick={() => navigate("/upload")}>
            Upload your first document
          </button>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Filename</th>
                <th>Document Type</th>
                <th>Status</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.documentId}
                  className="clickable-row"
                  onClick={() => navigate(`/documents/${doc.documentId}`)}
                >
                  <td>{doc.documentId}</td>
                  <td>{doc.filename}</td>
                  <td>{(doc.documentType || "").replace(/_/g, " ")}</td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                  <td>
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="btn btn-secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
