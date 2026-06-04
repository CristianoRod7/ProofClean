import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisSummary from '../components/analysis/AnalysisSummary.jsx';
import RiskScoreCard from '../components/analysis/RiskScoreCard.jsx';
import DetectionList from '../components/analysis/DetectionList.jsx';
import ImagePreviewPanel from '../components/analysis/ImagePreviewPanel.jsx';
import RiskScenarioCard from '../components/analysis/RiskScenarioCard.jsx';
import RecommendationList from '../components/analysis/RecommendationList.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { createMaskedVersion, getAnalysisById } from '../services/mockAnalysis.js';

export default function AnalysisResultPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [analysis, setAnalysis] = useState(() => getAnalysisById(id)); const [activeId, setActiveId] = useState(analysis?.findings?.[0]?.id);
  if (!analysis) return <MainLayout><ErrorAlert message="분석 결과를 찾을 수 없습니다." /></MainLayout>;
  const createMask = () => { const updated = createMaskedVersion(id); setAnalysis(updated); navigate(`/analyses/${id}/compare`); };
  return <MainLayout><div className="page-wide grid"><AnalysisSummary analysis={analysis} /><div className="grid grid-2"><div className="card"><div className="between"><h3>원본 이미지 · 탐지 박스</h3><span className="badge badge-yellow">탐지 후보 {analysis.findings.length}개</span></div><ImagePreviewPanel src={analysis.filePreviewUrl} findings={analysis.findings} activeId={activeId} onSelect={setActiveId} /></div><RiskScoreCard score={analysis.riskScore} riskLevel={analysis.riskLevel} /></div><div className="grid grid-2"><div className="stack"><h2>탐지 후보</h2><DetectionList findings={analysis.findings} activeId={activeId} onSelect={setActiveId} /></div><div className="stack"><h2>위험 시나리오</h2>{analysis.scenarios.map((scenario) => <RiskScenarioCard key={scenario.id} scenario={scenario} />)}<RecommendationList items={analysis.recommendations} /></div></div><div className="card"><div className="between"><div><h2>다음 단계</h2><p className="muted">자동 마스킹된 안전본을 생성하고 원본/안전본 비교 화면에서 확인하세요.</p></div><div className="row"><button className="btn btn-primary" onClick={createMask}>안전본 생성</button><Link className="btn btn-secondary" to={`/analyses/${id}/compare`}>비교 화면 보기</Link><Link className="btn btn-muted" to="/history">기록으로 돌아가기</Link></div></div></div></div></MainLayout>;
}
