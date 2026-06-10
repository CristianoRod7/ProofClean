import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { purposeMeta } from '../../data/demoAnalyses.js';
import { formatDate } from '../../utils/formatDate.js';
import { getRiskLabel, getStatusLabel } from '../../utils/riskUtils.js';

export default function RecentAnalysisTable({ analyses = [], limit = 6, compact = false }) {
  const recent = analyses.slice(0, limit);

  return (
    <section className={`board-log-section dashboard-recent-section ${compact ? 'is-compact' : ''}`}>
      <div className="onboarding-section-head recent-section-head">
        <span>최근 기록</span>
        <div><h2>최근 분석 기록</h2><p>분석 결과와 안전본을 다시 확인할 수 있습니다.</p></div>
        <Link to="/history">전체 기록 보기 <ArrowUpRight size={15} /></Link>
      </div>
      {!recent.length ? (
        <div className="dashboard-recent-empty"><Clock3 size={24} /><div><h3>아직 분석 기록이 없습니다.</h3><p>새 분석을 시작해 첫 번째 안전본을 만들어보세요.</p></div><Link className="board-button" to="/analyses/new">새 분석 시작</Link></div>
      ) : (
        <div className="dashboard-recent-list">
          {recent.map((analysis) => (
            <Link to={`/analyses/${analysis.id}/result`} key={analysis.id}>
              <span className="recent-purpose">{purposeMeta[analysis.purpose]?.label || analysis.purpose}</span>
              <div><h3>{analysis.title}</h3><p>{formatDate(analysis.createdAt)} · {getStatusLabel(analysis.status)}</p></div>
              <span className="recent-risk"><small>{getRiskLabel(analysis.riskLevel || analysis.riskScore)}</small><b>{analysis.riskScore}점</b></span>
              <span className="recent-open">결과 보기 <ArrowUpRight size={15} /></span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
