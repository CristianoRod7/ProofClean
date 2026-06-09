import { CalendarDays, Clock3, ShieldCheck } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusLabel } from '../../utils/riskUtils.js';
import Badge from '../common/Badge.jsx';

export default function AnalysisSummary({ analysis }) {
  const meta = purposeMeta[analysis.purpose];
  return (
    <section className="analysis-summary card">
      <div>
        <div className="row">
          <Badge color="blue">{meta?.label || analysis.purpose}</Badge>
          <Badge color={analysis.status === 'MASKED' ? 'green' : 'yellow'}><ShieldCheck size={14} /> {getStatusLabel(analysis.status)}</Badge>
        </div>
        <h1>{analysis.title}</h1>
        <p className="muted">{meta?.description}</p>
      </div>
      <div className="summary-meta">
        <span><CalendarDays size={16} /> {formatDate(analysis.createdAt)}</span>
        <span><Clock3 size={16} /> 사용자 최종 확인 필요</span>
      </div>
    </section>
  );
}
