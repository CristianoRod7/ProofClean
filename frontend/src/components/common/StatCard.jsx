import Card from './Card.jsx';

export default function StatCard({ icon, label, value, hint, tone = 'blue' }) {
  return (
    <Card className={`stat-card stat-${tone}`} interactive>
      <div>
        <p className="stat-label">{label}</p>
        <div className="stat-value">{value}</div>
        {hint && <small className="muted">{hint}</small>}
      </div>
      <div className="stat-icon">{icon}</div>
    </Card>
  );
}
