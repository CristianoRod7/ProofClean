import { Link } from 'react-router-dom';
export default function EmptyState({ title = '아직 데이터가 없습니다', description = '새 분석을 시작해보세요.', actionLabel, actionTo }) {
  return <div className="card" style={{ textAlign: 'center', padding: 42 }}><h2>{title}</h2><p className="muted">{description}</p>{actionLabel && actionTo && <Link className="btn btn-primary" to={actionTo}>{actionLabel}</Link>}</div>;
}
