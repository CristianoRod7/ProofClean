import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ContextVisual from '../components/visuals/ContextVisual.jsx';
import { getAnalyses } from '../services/mockAnalysis.js';
import { purposeMeta } from '../data/demoAnalyses.js';
import { formatDate } from '../utils/formatDate.js';
import { getRiskLabel } from '../utils/riskUtils.js';

export default function HistoryPage() {
  const analyses = getAnalyses();
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('ALL');
  const [risk, setRisk] = useState('ALL');
  const filtered = useMemo(() => analyses.filter((analysis) => `${analysis.title} ${analysis.fileName}`.toLowerCase().includes(query.toLowerCase()) && (purpose === 'ALL' || analysis.purpose === purpose) && (risk === 'ALL' || analysis.riskLevel === risk)), [analyses, query, purpose, risk]);
  return (
    <MainLayout><div className="page-wide board-page history-page">
      <section className="board-page-header"><div><span>LOCAL RECORDS / {analyses.length} TOTAL</span><h1>Scan Archive</h1><p>Search the privacy scans stored in this browser.</p></div></section>
      <section className="board-filterbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or file" /></div><select value={purpose} onChange={(event) => setPurpose(event.target.value)}><option value="ALL">All contexts</option>{Object.entries(purposeMeta).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select><select value={risk} onChange={(event) => setRisk(event.target.value)}><option value="ALL">All risks</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select><span><SlidersHorizontal size={14} /> {filtered.length} records</span></section>
      {!filtered.length ? <EmptyState title="조건에 맞는 기록이 없습니다" description="필터를 변경하거나 새 분석을 시작해보세요." actionLabel="새 분석 시작" actionTo="/analyses/new" /> : <section className="archive-grid">{filtered.map((analysis) => <Link className="showcase-card archive-card" to={`/analyses/${analysis.id}/result`} key={analysis.id}><div className="card-label"><span>{purposeMeta[analysis.purpose]?.label || analysis.purpose}</span><em>{analysis.status}</em></div><ContextVisual type={analysis.purpose} /><div className="archive-copy"><h2>{analysis.title}</h2><p>{analysis.fileName || 'Sample preview'}</p></div><footer><span>{formatDate(analysis.updatedAt || analysis.createdAt)}</span><div><small>{getRiskLabel(analysis.riskLevel || analysis.riskScore)}</small><b>{analysis.riskScore}</b><ArrowUpRight size={16} /></div></footer></Link>)}</section>}
    </div></MainLayout>
  );
}
