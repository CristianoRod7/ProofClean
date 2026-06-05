import { Link } from 'react-router-dom';
import { Inbox, Sparkles } from 'lucide-react';
import Card from './Card.jsx';

export default function EmptyState({ title = '아직 데이터가 없습니다', description = '새 분석을 시작해보세요.', actionLabel, actionTo }) {
  return (
    <Card className="empty-state">
      <div className="empty-orb">
        <Inbox size={30} />
        <Sparkles size={16} className="empty-spark" />
      </div>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      {actionLabel && actionTo && <Link className="btn btn-primary" to={actionTo}>{actionLabel}</Link>}
    </Card>
  );
}
