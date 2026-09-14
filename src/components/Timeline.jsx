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

const STATUS_LABELS = {
  UPLOADED: "Uploaded",
  PROCESSING: "Processing",
  PROCESSED: "Processed",
  FAILED: "Failed",
};

const REASON_MESSAGES = {
  PROCESSOR_TIMEOUT: "Processor timed out",
  MAX_RETRIES_EXCEEDED: "Maximum retries exceeded — processing failed",
  PROCESSOR_ERROR: "Processor encountered an error",
  INVALID_RESULT: "Invalid data returned by processor",
  VALIDATION_FAILED: "Extracted data failed validation",
};

const MAX_ATTEMPTS = 3;

function formatReason(reason) {
  return REASON_MESSAGES[reason] || reason;
}

function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

function formatAttempt(attemptNumber) {
  return `Attempt ${attemptNumber} of ${MAX_ATTEMPTS}`;
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

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
                  {formatStatus(entry.status)}
                </span>
              </div>
              {entry.attemptNumber != null && (
                <div className="timeline-meta">
                  {formatAttempt(entry.attemptNumber)}
                </div>
              )}
              {entry.reason && (
                <div className="timeline-reason">{formatReason(entry.reason)}</div>
              )}
              {entry.timestamp && (
                <div className="timeline-time">
                  {formatTimestamp(entry.timestamp)}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
