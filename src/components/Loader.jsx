export function Spinner({ size = 24 }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="skeleton-row" key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <div className="skeleton-cell" key={c} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-wrap">
      <Spinner size={32} />
      <p>{label}</p>
    </div>
  );
}
