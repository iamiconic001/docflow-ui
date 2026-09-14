export default function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
