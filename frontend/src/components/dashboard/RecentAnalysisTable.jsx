import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import { formatDate } from '../../utils/formatDate.js';
import { getRiskBadgeColor, getRiskLabel } from '../../utils/riskUtils.js';
import EmptyState from '../common/EmptyState.jsx';

export default function RecentAnalysisTable({ analyses = [] }) {
  if (!analyses.length) {
    return <EmptyState title="최근 분석이 없습니다" description="새 분석을 시작하면 이곳에 기록이 표시됩니다." actionLabel="새 분석 시작" actionTo="/analyses/new" />;
  }
  return (
    <section className="card table-card">
      <div className="section-head compact">
        <div>
          <span className="eyebrow">Recent checks</span>
          <h2>최근 분석</h2>
        </div>
        <span className="badge badge-dark">{analyses.length}건</span>
      </div>
      <div className="responsive-table">
        <table className="table">
          <thead><tr><th>제목</th><th>목적</th><th>위험도</th><th>상태</th><th>생성일</th><th /></tr></thead>
          <tbody>
            {analyses.slice(0, 6).map((analysis) => (
              <tr key={analysis.id}>
                <td><b>{analysis.title}</b><small>{analysis.fileName || '샘플/업로드 대기'}</small></td>
                <td>{purposeMeta[analysis.purpose]?.label || analysis.purpose}</td>
                <td><span className={`badge badge-${getRiskBadgeColor(analysis.riskLevel || analysis.riskScore)}`}>{analysis.riskScore} · {getRiskLabel(analysis.riskLevel || analysis.riskScore)}</span></td>
                <td><span className="status-pill">{analysis.status}</span></td>
                <td>{formatDate(analysis.createdAt)}</td>
                <td><Link className="btn btn-muted btn-sm" to={`/analyses/${analysis.id}/result`}>상세 <ArrowUpRight size={15} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
