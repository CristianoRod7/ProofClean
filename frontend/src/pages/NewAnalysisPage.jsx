import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisFlowHeader from '../components/analysis/AnalysisFlowHeader.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import ModePreviewPanel from '../components/analysis/ModePreviewPanel.jsx';
import ResultPreviewGuide from '../components/analysis/ResultPreviewGuide.jsx';
import DetectionCriteriaSummary from '../components/analysis/DetectionCriteriaSummary.jsx';
import AnalysisModeSelector from '../components/upload/AnalysisModeSelector.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { createAnalysisApi } from '../services/analysisApi.js';
import { purposeMeta } from '../data/demoAnalyses.js';
import { getScenarioAsset } from '../config/scenarioAssets.js';

const DEFAULT_MODE = 'SECOND_HAND';

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [hoveredMode, setHoveredMode] = useState(null);
  const previewMode = selectedMode || hoveredMode || DEFAULT_MODE;
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!selectedMode) {
      setError('점검할 업로드 상황을 선택하세요.');
      return;
    }
    if (!title.trim()) {
      setError('분석 제목을 입력하세요.');
      return;
    }
    const created = await createAnalysisApi({ title: title.trim(), purpose: selectedMode });
    navigate(`/analyses/${created.id}/upload`);
  };

  return (
    <MainLayout>
      <form className="page-wide board-page new-analysis-page" onSubmit={submit}>
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <AnalysisFlowHeader
            eyebrow="새 분석 · 1단계"
            title="어떤 상황의 파일인가요?"
            description="공유 목적에 따라 얼굴, 위치, 송장, 학번처럼 확인해야 할 단서가 달라집니다."
          />
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={60}><AnalysisProgress current={1} /></ScrollReveal>
        <ErrorAlert message={error} />
        <ScrollReveal className="flow-reveal" delay={90}>
          <section className="analysis-title-row interactive-flow-card" aria-labelledby="analysis-title-label">
            <label className="field-label" id="analysis-title-label" htmlFor="analysis-title">분석 제목</label>
            <input
              id="analysis-title"
              className="input"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setTitleEdited(true);
              }}
              placeholder="상황을 선택하면 기본 제목이 입력됩니다."
            />
          </section>
        </ScrollReveal>
        <section className="analysis-mode-section" aria-labelledby="analysis-mode-heading">
          <ScrollReveal className="flow-reveal" delay={110}>
            <div className="analysis-section-heading">
              <span className="eyebrow">분석 목적</span>
              <div>
                <h2 id="analysis-mode-heading">공유 상황을 선택하세요</h2>
                <p>선택한 상황에 따라 확인할 탐지 후보와 권장 조치가 달라집니다.</p>
              </div>
              <span className="badge badge-dark">선택 필수</span>
            </div>
          </ScrollReveal>
          <div className="analysis-mode-workspace">
            <div className="analysis-mode-main">
              <AnalysisModeSelector
                value={selectedMode}
                onChange={(mode) => {
                  setSelectedMode(mode);
                  setHoveredMode(null);
                  if (!titleEdited) setTitle(getScenarioAsset(mode).defaultTitle);
                }}
                onHover={setHoveredMode}
                previewLocked={Boolean(selectedMode)}
              />
              <DetectionCriteriaSummary />
            </div>
            <div className="mode-preview-column">
              <ModePreviewPanel mode={previewMode} locked={Boolean(selectedMode)} />
              <ResultPreviewGuide />
            </div>
          </div>
        </section>
        <ScrollReveal className="flow-reveal" delay={130}>
          <div className={`board-sticky-cta interactive-flow-card ${selectedMode ? 'is-ready' : 'is-waiting'}`}>
            <div className="analysis-action-copy" key={selectedMode || 'empty'}>
              <b>{selectedMode ? `선택됨: ${purposeMeta[selectedMode].label}` : '점검할 상황을 선택하면 다음 단계로 이동할 수 있습니다.'}</b>
              <p className="muted">
                {selectedMode
                  ? `확인 단서: ${purposeMeta[selectedMode].examples.join(' · ')}`
                  : '선택한 상황에 따라 탐지 후보와 권장 조치가 자동으로 구성됩니다.'}
              </p>
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={!selectedMode}>
              {selectedMode ? '다음 단계로' : '상황을 선택하세요'} <ArrowRight size={18} />
            </button>
          </div>
        </ScrollReveal>
      </form>
    </MainLayout>
  );
}
