import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import { formatDate } from '../../utils/formatDate.js';
import { getRiskLabel } from '../../utils/riskUtils.js';
import ContextVisual from '../visuals/ContextVisual.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function RecentAnalysisTable({ analyses = [] }) {
  if (!analyses.length) return <EmptyState title="최근 분석이 없습니다" description="새 분석을 시작하면 이곳에 기록이 표시됩니다." actionLabel="새 분석 시작" actionTo="/analyses/new" />;
  return (
    <section className="board-log-section">
      <div className="board-section-head"><div><span>RECENT SCANS</span><h2>Local scan log.</h2></div><b>{analyses.length} records</b></div>
      <div className="scan-log-grid">
        {analyses.slice(0, 6).map((analysis) => (
          <Link className="showcase-card scan-log-card" to={`/analyses/${analysis.id}/result`} key={analysis.id}>
            <div className="card-label"><span>{purposeMeta[analysis.purpose]?.label || analysis.purpose}</span><em>{analysis.status}</em></div>
            <ContextVisual type={analysis.purpose} />
            <div className="scan-log-body"><h3>{analysis.title}</h3><p>{formatDate(analysis.createdAt)}</p></div>
            <footer><span>{getRiskLabel(analysis.riskLevel || analysis.riskScore)}</span><b>{analysis.riskScore}</b><ArrowUpRight size={16} /></footer>
          </Link>
        ))}
      </div>
    </section>
  );
}
