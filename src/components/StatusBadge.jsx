const STATUS_STYLES = {
  UPLOADED: { bg: "#dbeafe", color: "#1d4ed8", label: "Uploaded" },
  PROCESSING: { bg: "#fef3c7", color: "#b45309", label: "Processing" },
  PROCESSED: { bg: "#dcfce7", color: "#15803d", label: "Processed" },
  FAILED: { bg: "#fee2e2", color: "#b91c1c", label: "Failed" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    bg: "#e5e7eb",
    color: "#374151",
    label: status || "Unknown",
  };

  return (
    <span
      className="status-badge"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
