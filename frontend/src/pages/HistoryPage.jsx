import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAnalyses } from '../hooks/useMockAnalysis.js';
import { formatDate } from '../utils/formatDate.js';
import { getRiskBadgeColor } from '../utils/riskUtils.js';

export default function HistoryPage() {
  const { analyses } = useAnalyses(); const [query, setQuery] = useState(''); const [purpose, setPurpose] = useState('ALL'); const [risk, setRisk] = useState('ALL');
  const filtered = useMemo(() => analyses.filter((a) => (purpose === 'ALL' || a.purpose === purpose) && (risk === 'ALL' || a.riskLevel === risk) && a.title.toLowerCase().includes(query.toLowerCase())), [analyses, query, purpose, risk]);
  return <MainLayout><div className="page-wide grid"><div><span className="badge badge-blue">History</span><h1>분석 기록</h1><p className="muted">localStorage에 저장된 시연 기록을 검색하고 다시 확인할 수 있습니다.</p></div><div className="card"><div className="grid grid-3"><input className="input" placeholder="제목 검색" value={query} onChange={(e) => setQuery(e.target.value)} /><select className="select" value={purpose} onChange={(e) => setPurpose(e.target.value)}><option value="ALL">전체 목적</option><option value="SNS">SNS</option><option value="SECOND_HAND">중고거래</option><option value="ASSIGNMENT">과제 제출</option><option value="COMMUNITY">커뮤니티</option><option value="ETC">기타</option></select><select className="select" value={risk} onChange={(e) => setRisk(e.target.value)}><option value="ALL">전체 위험도</option><option value="CRITICAL">매우 높음</option><option value="HIGH">높음</option><option value="MEDIUM">주의</option><option value="LOW">낮음</option></select></div></div>{filtered.length === 0 ? <EmptyState title="검색 결과가 없습니다" description="필터를 조정하거나 새 분석을 시작하세요." actionLabel="새 분석 시작" actionTo="/analyses/new" /> : <div className="card"><table className="table"><thead><tr><th>제목</th><th>목적</th><th>위험도</th><th>상태</th><th>생성일</th><th /></tr></thead><tbody>{filtered.map((a) => <tr key={a.id}><td><b>{a.title}</b></td><td>{a.purpose}</td><td><span className={`badge badge-${getRiskBadgeColor(a.riskLevel || a.riskScore)}`}>{a.riskScore}</span></td><td>{a.status}</td><td>{formatDate(a.createdAt)}</td><td><Link className="btn btn-muted" to={`/analyses/${a.id}/result`}>상세보기</Link></td></tr>)}</tbody></table></div>}</div></MainLayout>;
}
