import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, GitCompare, Info, WandSparkles } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import AnalysisSummary from '../components/analysis/AnalysisSummary.jsx';
import RiskScoreCard from '../components/analysis/RiskScoreCard.jsx';
import DetectionList from '../components/analysis/DetectionList.jsx';
import ImagePreviewPanel from '../components/analysis/ImagePreviewPanel.jsx';
import RiskScenarioCard from '../components/analysis/RiskScenarioCard.jsx';
import RecommendationList from '../components/analysis/RecommendationList.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import Card from '../components/common/Card.jsx';
import { createMaskedVersion, getAnalysisById, runMockAnalysis } from '../services/mockAnalysis.js';

export default function AnalysisResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(() => {
    const found = getAnalysisById(id);
    if (found && found.status !== 'ANALYZED' && found.status !== 'MASKED') return runMockAnalysis(id);
    return found;
  });
  const [activeId, setActiveId] = useState(() => analysis?.findings?.[0]?.id || '');
  const activeFinding = useMemo(() => analysis?.findings?.find((finding) => finding.id === activeId), [analysis, activeId]);

  if (!analysis) return <MainLayout><ErrorAlert message="분석 결과를 찾을 수 없습니다." /></MainLayout>;

  const createMask = () => {
    const next = createMaskedVersion(id);
    setAnalysis(next);
    navigate(`/analyses/${id}/compare`);
  };

  return (
    <MainLayout>
      <div className="page-wide board-page result-page">
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <div className="report-kicker board-report-kicker"><span>노출 가능성 분석 결과</span><b>노출 가능성 / {analysis.riskScore}</b></div>
          <AnalysisSummary analysis={analysis} />
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={50}><AnalysisProgress current={3} /></ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={70}>
        <div className="result-notice" role="note">
          <span><Info size={19} /></span>
          <div><b>분석 결과는 탐지 후보입니다.</b><p>개인정보 확정 판정이 아니며, 업로드 전 최종 확인은 사용자가 직접 해야 합니다.</p></div>
        </div>
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={90}>
        <div className="result-grid board-result-grid">
          <Card className="image-analysis-card showcase-card">
            <div className="section-head compact">
              <div>
                <span className="eyebrow">탐지 위치</span>
                <h2>원본 이미지 미리보기</h2>
              </div>
              <span className="badge badge-yellow">박스 클릭 가능</span>
            </div>
            <ImagePreviewPanel
              src={analysis.filePreviewUrl}
              purpose={analysis.purpose}
              findings={analysis.findings}
              activeId={activeId}
              onSelect={setActiveId}
            />
            {activeFinding && (
              <div className="active-finding-card">
                <b>{activeFinding.label}</b>
                <p>{activeFinding.description}</p>
              </div>
            )}
          </Card>
          <aside className="stack result-aside">
            <RiskScoreCard score={analysis.riskScore} level={analysis.riskLevel} findingsCount={analysis.findings.length} />
            <Card className="cta-card">
              <span className="eyebrow">다음 단계</span>
              <h2>안전본을 생성하고 비교하세요</h2>
              <p className="muted">탐지 후보 좌표를 기준으로 검은 마스킹 박스를 올린 안전본 미리보기를 만듭니다.</p>
              <div className="stack">
                <button className="btn btn-primary btn-block" onClick={createMask}><WandSparkles size={18} /> 안전본 생성</button>
                <Link className="btn btn-secondary btn-block" to={`/analyses/${id}/compare`}><GitCompare size={18} /> 원본/안전본 비교</Link>
                <Link className="btn btn-muted btn-block" to="/history"><ArrowLeft size={18} /> 기록으로 돌아가기</Link>
              </div>
            </Card>
          </aside>
        </div>
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={110}>
        <div className="result-lower-grid board-result-lower">
          <section className="card">
            <div className="section-head compact"><div><span className="eyebrow">탐지 후보</span><h2>탐지 후보</h2></div><span className="badge badge-dark">{analysis.findings.length}개</span></div>
            <DetectionList findings={analysis.findings} activeId={activeId} onSelect={setActiveId} />
          </section>
          <section className="stack">
            <Card>
              <div className="section-head compact"><div><span className="eyebrow">위험 시나리오</span><h2>위험 시나리오</h2></div></div>
              <div className="scenario-list">{analysis.scenarios.map((scenario, index) => <RiskScenarioCard key={scenario.id} scenario={scenario} index={index} />)}</div>
            </Card>
            <Card><RecommendationList items={analysis.recommendations} /></Card>
          </section>
        </div>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
}
