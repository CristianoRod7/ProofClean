import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { getAnalyses } from '../services/mockAnalysis.js';
import { purposeMeta } from '../data/demoAnalyses.js';
import { formatDate } from '../utils/formatDate.js';
import { getRiskBadgeColor, getRiskLabel } from '../utils/riskUtils.js';

export default function HistoryPage() {
  const analyses = getAnalyses();
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('ALL');
  const [risk, setRisk] = useState('ALL');

  const filtered = useMemo(() => analyses.filter((analysis) => {
    const matchesQuery = `${analysis.title} ${analysis.fileName}`.toLowerCase().includes(query.toLowerCase());
    const matchesPurpose = purpose === 'ALL' || analysis.purpose === purpose;
    const matchesRisk = risk === 'ALL' || analysis.riskLevel === risk;
    return matchesQuery && matchesPurpose && matchesRisk;
  }), [analyses, query, purpose, risk]);

  return (
    <MainLayout>
      <div className="page-wide history-page">
        <section className="page-hero compact">
          <span className="badge badge-cyan">History</span>
          <h1>분석 기록</h1>
          <p>localStorage에 저장된 분석 기록을 검색하고 목적/위험도별로 필터링합니다.</p>
        </section>
        <section className="history-filters card">
          <div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목 또는 파일명 검색" /></div>
          <select className="select" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
            <option value="ALL">전체 목적</option>
            {Object.entries(purposeMeta).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
          </select>
          <select className="select" value={risk} onChange={(event) => setRisk(event.target.value)}>
            <option value="ALL">전체 위험도</option>
            <option value="LOW">낮음</option>
            <option value="MEDIUM">주의</option>
            <option value="HIGH">높음</option>
            <option value="CRITICAL">매우 높음</option>
          </select>
          <span className="badge badge-dark"><SlidersHorizontal size={14} /> {filtered.length}건</span>
        </section>
        {!filtered.length ? <EmptyState title="조건에 맞는 기록이 없습니다" description="필터를 변경하거나 새 분석을 시작해보세요." actionLabel="새 분석 시작" actionTo="/analyses/new" /> : (
          <section className="card table-card history-table-card">
            <div className="responsive-table">
              <table className="table">
                <thead><tr><th>분석</th><th>목적</th><th>위험도</th><th>탐지 후보</th><th>상태</th><th>업데이트</th><th /></tr></thead>
                <tbody>
                  {filtered.map((analysis) => (
                    <tr key={analysis.id}>
                      <td><b>{analysis.title}</b><small>{analysis.fileName || '업로드 대기'}</small></td>
                      <td>{purposeMeta[analysis.purpose]?.label || analysis.purpose}</td>
                      <td><span className={`badge badge-${getRiskBadgeColor(analysis.riskLevel || analysis.riskScore)}`}>{analysis.riskScore} · {getRiskLabel(analysis.riskLevel || analysis.riskScore)}</span></td>
                      <td>{analysis.findings?.length || 0}개</td>
                      <td><span className="status-pill">{analysis.status}</span></td>
                      <td>{formatDate(analysis.updatedAt || analysis.createdAt)}</td>
                      <td><Link className="btn btn-primary btn-sm" to={`/analyses/${analysis.id}/result`}>상세보기</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="history-card-list">
              {filtered.map((analysis) => (
                <article className="history-mobile-card" key={`${analysis.id}-mobile`}>
                  <div className="between"><b>{analysis.title}</b><span className={`badge badge-${getRiskBadgeColor(analysis.riskLevel || analysis.riskScore)}`}>{analysis.riskScore}</span></div>
                  <p>{purposeMeta[analysis.purpose]?.label} · {formatDate(analysis.updatedAt || analysis.createdAt)}</p>
                  <Link className="btn btn-muted btn-block" to={`/analyses/${analysis.id}/result`}>상세보기</Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
