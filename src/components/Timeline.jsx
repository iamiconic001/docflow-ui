const STATUS_COLORS = {
  UPLOADED: "#2563eb",
  PROCESSING: "#d97706",
  PROCESSED: "#16a34a",
  FAILED: "#dc2626",
};

const STATUS_ICONS = {
  UPLOADED: "↑",
  PROCESSING: "⟳",
  PROCESSED: "✓",
  FAILED: "✕",
};

export default function Timeline({ history }) {
  if (!history || history.length === 0) {
    return <p className="empty-hint">No processing history available.</p>;
  }

  return (
    <ol className="timeline">
      {history.map((entry, idx) => {
        const color = STATUS_COLORS[entry.status] || "#6b7280";
        const icon = STATUS_ICONS[entry.status] || "•";
        return (
          <li className="timeline-item" key={entry.id ?? idx}>
            <span className="timeline-icon" style={{ backgroundColor: color }}>
              {icon}
            </span>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-status" style={{ color }}>
                  {entry.status}
                </span>
                {entry.timestamp && (
                  <span className="timeline-time">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              {entry.attemptNumber != null && (
                <div className="timeline-meta">
                  Attempt #{entry.attemptNumber}
                </div>
              )}
              {entry.reason && (
                <div className="timeline-reason">{entry.reason}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
