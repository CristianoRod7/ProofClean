import Card from './Card.jsx';
export default function StatCard({ icon, label, value, hint }) {
  return <Card className="stat-card"><div><p className="muted">{label}</p><div className="stat-value">{value}</div>{hint && <small className="muted">{hint}</small>}</div><div className="stat-icon">{icon}</div></Card>;
}
