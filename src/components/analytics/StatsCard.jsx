const StatsCard = ({ title, value, tone = 'primary' }) => {
  const toneClass =
    tone === 'success' ? 'badge-success' : tone === 'warning' ? 'badge-warning' : tone === 'danger' ? 'badge-danger' : 'badge-primary';

  return (
    <div className="card">
      <div className="card-body">
        <span className={`badge ${toneClass}`}>{title}</span>
        <h2 style={{ marginBottom: 0 }}>{value}</h2>
      </div>
    </div>
  );
};

export default StatsCard;
